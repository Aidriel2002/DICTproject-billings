import { supabase } from './supabaseClient';
import emailjs from '@emailjs/browser';

const SHARED_BUCKET = 'shared-data';
const SHARED_FILES = {
  payments: 'payments.csv',
  history: 'payment_history.csv',
  json: 'data_export.json',
  report: 'data_report.txt'
};

/**
 * Formats payment data for sharing
 */
const formatPaymentsData = (payments) => {
  return payments.map(payment => ({
    'Site Name': payment.siteName,
    'Account Name': payment.accountName,
    'Account Number': payment.accountNumber,
    'Due Date': `Day ${payment.dueDate}`,
    'Monthly Payment': `₱${payment.monthlyPayment?.toLocaleString() || 0}`,
    'Installation Fee': `₱${payment.installationFee?.toLocaleString() || 0}`,
    'Status': payment.remarks,
    'Phase': payment.phase || 'N/A',
    'Created At': payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'
  }));
};

/**
 * Formats payment history data for sharing
 */
const formatPaymentHistoryData = (paymentHistory) => {
  return paymentHistory.map(history => ({
    'Site Name': history.siteName,
    'Account Name': history.accountName,
    'Account Number': history.accountNumber,
    'Amount Paid': `₱${history.amountPaid?.toLocaleString() || 0}`,
    'Installation Fee': `₱${history.installationFee?.toLocaleString() || 0}`,
    'Payment Date': history.paymentDate ? new Date(history.paymentDate).toLocaleString() : 'N/A',
    'Reference Number': history.referenceNumber || 'N/A',
    'Notes': history.notes || 'N/A',
    'Created At': history.createdAt ? new Date(history.createdAt).toLocaleString() : 'N/A'
  }));
};

/**
 * Converts data to CSV format
 */
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return headers.join(',') + '\nNo data available';
  }

  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Converts data to JSON format
 */
const convertToJSON = (data) => {
  return JSON.stringify(data, null, 2);
};

/**
 * Creates a formatted text report
 */
const createTextReport = (payments, paymentHistory) => {
  const paymentsData = formatPaymentsData(payments);
  const historyData = formatPaymentHistoryData(paymentHistory);
  
  let report = 'PAYMENT TRACKER SYSTEM - DATA EXPORT\n';
  report += '='.repeat(50) + '\n\n';
  
  report += `PAYMENTS DATA (${payments.length} records)\n`;
  report += '-'.repeat(50) + '\n';
  
  if (paymentsData.length === 0) {
    report += 'No payments data available.\n\n';
  } else {
    paymentsData.forEach((payment, index) => {
      report += `\nPayment ${index + 1}:\n`;
      Object.entries(payment).forEach(([key, value]) => {
        report += `  ${key}: ${value}\n`;
      });
    });
  }
  
  report += '\n\n';
  report += `PAYMENT HISTORY DATA (${paymentHistory.length} records)\n`;
  report += '-'.repeat(50) + '\n';
  
  if (historyData.length === 0) {
    report += 'No payment history data available.\n';
  } else {
    historyData.forEach((history, index) => {
      report += `\nHistory Record ${index + 1}:\n`;
      Object.entries(history).forEach(([key, value]) => {
        report += `  ${key}: ${value}\n`;
      });
    });
  }
  
  report += '\n' + '='.repeat(50) + '\n';
  report += `Generated on: ${new Date().toLocaleString()}\n`;
  
  return report;
};

const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(SHARED_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const getSignedUrl = async (path) => {
  const { data, error } = await supabase.storage
    .from(SHARED_BUCKET)
    .createSignedUrl(path, 7 * 24 * 60 * 60);

  if (error) throw error;
  return data.signedUrl;
};

const generateShareUrls = async (shareId) => {
  const urls = {};

  for (const [key, fileName] of Object.entries(SHARED_FILES)) {
    const path = `${shareId}/${fileName}`;
    try {
      urls[key] = await getSignedUrl(path);
    } catch (error) {
      console.log(`Signed URL failed for ${fileName}, using public URL`, error?.message);
      urls[key] = getPublicUrl(path);
    }
  }

  return urls;
};

/**
 * Uploads files to Supabase Storage bucket and returns shareable URLs
 */
const uploadToSupabaseStorage = async (recipientEmail, payments, paymentHistory) => {
  try {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Format the data
    const paymentsData = formatPaymentsData(payments);
    const historyData = formatPaymentHistoryData(paymentHistory);
    
    // Create file contents
    const paymentsHeaders = paymentsData.length > 0 ? Object.keys(paymentsData[0]) : ['No Data'];
    const historyHeaders = historyData.length > 0 ? Object.keys(historyData[0]) : ['No Data'];
    const csvPayments = convertToCSV(paymentsData, paymentsHeaders);
    const csvHistory = convertToCSV(historyData, historyHeaders);
    const jsonData = {
      meta: {
        recipientEmail,
        exportedAt: new Date().toISOString()
      },
      paymentsRaw: payments,
      paymentHistoryRaw: paymentHistory,
      paymentsFormatted: paymentsData,
      paymentHistoryFormatted: historyData
    };
    const textReport = createTextReport(payments, paymentHistory);
    
    // Create file paths
    const folderPath = `${shareId}`;
    const paymentsCsvPath = `${folderPath}/${SHARED_FILES.payments}`;
    const historyCsvPath = `${folderPath}/${SHARED_FILES.history}`;
    const jsonPath = `${folderPath}/${SHARED_FILES.json}`;
    const reportPath = `${folderPath}/${SHARED_FILES.report}`;
    
    // Upload files to Supabase Storage
    const uploadFile = async (path, content, contentType) => {
      const blob = new Blob([content], { type: contentType });
      const { error } = await supabase.storage
        .from(SHARED_BUCKET)
        .upload(path, blob, {
          contentType: contentType,
          upsert: false
        });
      
      if (error) throw error;
    };
    
    // Upload all files
    await uploadFile(paymentsCsvPath, csvPayments, 'text/csv');
    await uploadFile(historyCsvPath, csvHistory, 'text/csv');
    await uploadFile(jsonPath, JSON.stringify(jsonData, null, 2), 'application/json');
    await uploadFile(reportPath, textReport, 'text/plain');
    
    const urls = await generateShareUrls(shareId);
    const shareLink = typeof window !== 'undefined'
      ? `${window.location.origin}/shared/${shareId}`
      : '';
    
    return {
      shareId,
      urls,
      folderPath,
      shareLink
    };
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw error;
  }
};

export const fetchSharedData = async (shareId) => {
  if (!shareId) {
    throw new Error('Missing share identifier.');
  }

  try {
    const dataPath = `${shareId}/${SHARED_FILES.json}`;
    const { data, error } = await supabase.storage
      .from(SHARED_BUCKET)
      .download(dataPath);

    if (error) {
      throw error;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    const urls = await generateShareUrls(shareId);

    return {
      shareId,
      ...parsed,
      urls
    };
  } catch (error) {
    console.error('Error fetching shared data:', error);
    throw new Error('Unable to load shared data. It may have expired or been removed.');
  }
};

/**
 * Shares data via email using EmailJS or Supabase storage
 */
export const shareDataByEmail = async (recipientEmail, payments, paymentHistory) => {
  try {
    // Format the data
    const paymentsData = formatPaymentsData(payments);
    const historyData = formatPaymentHistoryData(paymentHistory);
    const textReport = createTextReport(payments, paymentHistory);

    // Upload data to Supabase Storage bucket (if configured properly)
    let storageData = null;
    try {
      storageData = await uploadToSupabaseStorage(recipientEmail, payments, paymentHistory);
    } catch (storageError) {
      console.error('Storage upload failed:', storageError);
    }

    const summaryHtml = `
      <div class="summary">
        <h3>Summary:</h3>
        <ul>
          <li><strong>Total Payments:</strong> ${payments.length}</li>
          <li><strong>Total Payment History Records:</strong> ${paymentHistory.length}</li>
          <li><strong>Export Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
      </div>
    `;

    const summaryText = `Summary:
- Total Payments: ${payments.length}
- Total Payment History Records: ${paymentHistory.length}
- Export Date: ${new Date().toLocaleString()}
`;

    const downloadLinksHtml = storageData?.urls ? `
      <div class="data-section">
        <h3>Download Your Data Files:</h3>
        <ul class="download-links">
          <li><a href="${storageData.urls.payments}" target="_blank">📄 Payments Data (CSV)</a></li>
          <li><a href="${storageData.urls.history}" target="_blank">📄 Payment History (CSV)</a></li>
          <li><a href="${storageData.urls.json}" target="_blank">📄 Complete Data (JSON)</a></li>
          <li><a href="${storageData.urls.report}" target="_blank">📄 Data Report (TXT)</a></li>
        </ul>
        <p class="note">Links expire in 7 days. Please download the files before then.</p>
      </div>
    ` : `
      <div class="data-section">
        <h3>Download Your Data Files:</h3>
        <p>Automatic file upload is unavailable. The complete data report is included below.</p>
      </div>
    `;

    const downloadLinksText = storageData?.urls ? `
Download your data files (links expire in 7 days):
- Payments Data (CSV): ${storageData.urls.payments}
- Payment History (CSV): ${storageData.urls.history}
- Complete Data (JSON): ${storageData.urls.json}
- Data Report (TXT): ${storageData.urls.report}
` : `File upload unavailable. Complete data report included below.`;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .summary { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .data-section { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .download-links { list-style: none; padding: 0; }
            .download-links li { margin: 10px 0; }
            .download-links a { color: #3b82f6; text-decoration: none; font-weight: bold; }
            .note { color: #6b7280; font-size: 12px; margin-top: 10px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; font-size: 12px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Payment Tracker System - Data Export</h2>
            </div>
            <div class="content">
              <p>You have received shared data from Payment Tracker System.</p>
              ${summaryHtml}
              ${downloadLinksHtml}
              <div class="data-section">
                <h3>Complete Data Report:</h3>
                <pre>${textReport.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
              </div>
              <div class="footer">
                <p>This is an automated email from Payment Tracker System.</p>
                <p>Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `Payment Tracker System - Data Export
${summaryText}
${downloadLinksText}
---
Complete Data Report:
${textReport}
`;

    // Try EmailJS first (if configured)
    try {
      const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
      const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
      const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY);

        const templateParams = {
          to_email: recipientEmail,
          subject: 'Payment Tracker System - Data Export',
          message: htmlContent,
          text_content: textContent,
          payments_count: payments.length,
          history_count: paymentHistory.length,
          export_date: new Date().toLocaleString(),
          payments_url: storageData?.urls?.payments || '',
          history_url: storageData?.urls?.history || '',
          json_url: storageData?.urls?.json || '',
          report_url: storageData?.urls?.report || ''
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        return { success: true, message: 'Data shared successfully via email!' };
      }

      throw new Error('EmailJS not configured');
    } catch (emailjsError) {
      console.log('EmailJS not available, falling back to Supabase Edge Function or mailto...', emailjsError);

      if (storageData?.urls) {
        // Try Supabase Edge Function to send email
        try {
          const { error } = await supabase.functions.invoke('send-email', {
            body: {
              to: recipientEmail,
              subject: 'Payment Tracker System - Shared Data Files',
              html: htmlContent,
              text: textContent
            }
          });

          if (!error) {
            return { success: true, message: 'Data shared successfully! Download links have been sent to the recipient.' };
          }
        } catch (edgeError) {
          console.log('Edge function not available, using mailto with links');
        }

        // Mailto fallback with links
        const emailSubject = encodeURIComponent('Payment Tracker System - Shared Data Files');
        const emailBody = encodeURIComponent(textContent);
        window.location.href = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

        return {
          success: true,
          message: 'Data uploaded successfully! Email client opened with download links. Please send the email.',
          urls: storageData.urls
        };
      }

      // If storage upload also failed, include everything in mailto
      const emailSubject = encodeURIComponent('Payment Tracker System - Data Export');
      const emailBody = encodeURIComponent(textContent);
      window.location.href = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

      return {
        success: true,
        message: 'Email client opened with data. Please send the email to share the data.'
      };
    }
  } catch (error) {
    console.error('Error sharing data:', error);
    throw new Error('Failed to share data. Please try again.');
  }
};

/**
 * Alternative: Download data as files (fallback option)
 */
export const downloadDataAsFiles = (payments, paymentHistory) => {
  const paymentsData = formatPaymentsData(payments);
  const historyData = formatPaymentHistoryData(paymentHistory);
  
    const paymentsHeaders = paymentsData.length > 0 ? Object.keys(paymentsData[0]) : ['No Data'];
    const historyHeaders = historyData.length > 0 ? Object.keys(historyData[0]) : ['No Data'];
    const csvPayments = convertToCSV(paymentsData, paymentsHeaders);
    const csvHistory = convertToCSV(historyData, historyHeaders);
  const jsonData = {
    payments: paymentsData,
    paymentHistory: historyData,
    exportedAt: new Date().toISOString()
  };
  
  // Create and download files
  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  downloadFile(csvPayments, `payments_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  downloadFile(csvHistory, `payment_history_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  downloadFile(JSON.stringify(jsonData, null, 2), `data_export_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
};

