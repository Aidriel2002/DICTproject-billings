import React, { useState } from 'react';
import { getStatusColor, getDaysOverdue, isCoveredByAdvancePayment } from '../../utils/statusHelper';
import { PayBillModal } from '../Payments/PayBillModal';
import { styles } from '../../styles/dashboardStyles';

export const Dashboard = ({ payments, onUpdate, onAddHistory }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [isPhaseSummaryOpen, setPhaseSummaryOpen] = useState(false);

  const openPayBill = (payment) => {
    setSelectedPayment(payment);
    setPayModalOpen(true);
  };

  const handleConfirmPayment = async (updatedPayment) => {
    await onUpdate(updatedPayment);

    if ((updatedPayment.remarks === "Paid" || updatedPayment.remarks?.startsWith("Paid until")) && typeof onAddHistory === "function") {
      await onAddHistory({
        paymentId: updatedPayment.id,
        siteName: updatedPayment.siteName,
        accountName: updatedPayment.accountName,
        accountNumber: updatedPayment.accountNumber,
        amountPaid: updatedPayment.paidAmount,
        totalPaid: updatedPayment.totalPaid,
        installationFee: updatedPayment.installationFee,
        referenceNumber: updatedPayment.referenceNumber,
        paymentDate: updatedPayment.paymentDate,
        isAdvancePayment: updatedPayment.isAdvancePayment,
        advanceMonths: updatedPayment.advanceMonths,
        paidUntil: updatedPayment.paidUntil
      });
    }

    setPayModalOpen(false);
    setSelectedPayment(null);
  };

  const overduePayments = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    if (p.remarks === 'Paid') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return today > dueDate;
  });

  const dueLessThan7Days = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    if (p.remarks === 'Paid') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    due.setHours(0, 0, 0, 0);

    const diff = Math.ceil((due - today) / 86400000);
    return diff <= 7 && diff >= 0;
  }).sort((a, b) => a.dueDate - b.dueDate);

  const upcomingUnpaidBills = payments.filter(p => {
    if (isCoveredByAdvancePayment(p)) return false;
    if (p.remarks === 'Paid') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(today.getFullYear(), today.getMonth(), p.dueDate);
    due.setHours(0, 0, 0, 0);

    return Math.ceil((due - today) / 86400000) > 7;
  });

  const calculatePhaseWeeklySummary = () => {
    const baseWeeks = [
      { label: 'Week 1', start: 1, end: 7 },
      { label: 'Week 2', start: 8, end: 14 },
      { label: 'Week 3', start: 15, end: 21 },
      { label: 'Week 4', start: 22, end: 31 }
    ];

    const unpaidBills = payments.filter(p => {
      if (isCoveredByAdvancePayment(p)) return false;
      if (p.remarks === 'Paid') return false;
      return true;
    });

    const phaseWeeks = baseWeeks.map(week => ({
      ...week,
      phases: {},
      totalAllPhases: 0
    }));

    unpaidBills.forEach(bill => {
      const week = phaseWeeks.find(w => bill.dueDate >= w.start && bill.dueDate <= w.end);
      const phase = bill.phase || "Unspecified";

      if (!week.phases[phase]) {
        week.phases[phase] = { phase, bills: [], total: 0 };
      }

      week.phases[phase].bills.push(bill);
      week.phases[phase].total += bill.monthlyPayment;
      week.totalAllPhases += bill.monthlyPayment;
    });

    return phaseWeeks;
  };

  const printPhaseWeek = (week) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const today = new Date();
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${week.label} - Weekly Phase Summary - ${monthYear}</title>
        <style>
          @page { 
            margin: 80px 0 40px 0;
            size: auto;
          }
          * { 
            margin: 0px; 
            padding: 0; 
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 0 40px;
            color: #1e293b;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #10b981;
          }
          .header .logo {
            margin: 0;
            width: 390px;
            height: auto;
          }
          .header h1 {
            font-size: 24px;
            color: #0f172a;
            margin-bottom: 8px;
          }
          .header .subtitle {
            font-size: 16px;
            color: #64748b;
          }
          .summary-box {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
            text-align: right;
          }
          .summary-box .total {
            font-size: 20px;
            font-weight: 600;
            color: #0f172a;
          }
          .phase-section {
            margin: 40px 0;
            page-break-inside: avoid;
          }
          .phase-header {
            background: #f8fafc;
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 12px;
          }
          .phase-title {
            font-size: 18px;
            font-weight: 600;
            color: #334155;
          }
          .phase-total {
            color: #10b981;
            font-weight: 600;
            text-align: right;
            margin-right: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #334155;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .amount {
            text-align: right;
            font-weight: 500;
          }
          .no-bills {
            text-align: center;
            padding: 30px;
            color: #94a3b8;
            font-style: italic;
          }
          .print-header {
            display: none;
          }
          @media print {
            body { padding: 30px; }
            @page {
              margin-top: 80px;
            }
            @page:first {
              margin-top: 40px;
            }
            .print-header {
              display: block;
              position: running(header);
              text-align: center;
              padding: 15px 0;
              border-bottom: 2px solid #10b981;
            }
            .print-header h1 {
              font-size: 18px;
              color: #0f172a;
              margin: 0;
            }
            .print-header .subtitle {
              font-size: 13px;
              color: #64748b;
              margin-top: 4px;
            }
            @supports not (position: running(header)) {
              .print-header {
                display: none;
              }
              .header ~ .print-header-fallback {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: white;
                padding: 15px 40px;
                border-bottom: 2px solid #10b981;
                z-index: 1000;
                text-align: center;
              }
            }
            thead { display: table-header-group; }
            .phase-section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${week.label} - Phase Breakdown</h1>
          <div class="subtitle">${monthYear} • Day ${week.start} - Day ${week.end}</div>
        </div>
        <div class="header">
          <img src="/logo.png" alt="Logo" class="logo" />
          <h1>${week.label} - Phase Breakdown</h1>
          <div class="subtitle">${monthYear} • Day ${week.start} - Day ${week.end}</div>
        </div>
        

        ${Object.keys(week.phases).length === 0 ? `
          <div class="no-bills">No bills for this week</div>
        ` : `
          ${Object.values(week.phases).map(ph => `
            <div class="phase-section">
              <div class="phase-header">
                <span class="phase-title">${ph.phase}</span>
                
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Account</th>
                    <th>Account Number</th>
                    <th>Due Date</th>
                    <th class="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${ph.bills.map(b => `
                    <tr>
                      <td>${b.siteName}</td>
                      <td>${b.accountName}</td>
                      <td>${b.accountNumber}</td>
                      <td>Day ${b.dueDate}</td>
                      <td class="amount">₱${b.monthlyPayment.toLocaleString()}</td>
                    </tr>
                  `).join("")}
                </tbody>
                
              </table>
              <div class="phase-total">₱${ph.total.toLocaleString()}</div>
            </div>
            
          `).join("")}
        `}
        <div class="summary-box">
          <div class="total">Total (All Phases): ₱${week.totalAllPhases.toLocaleString()}</div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const renderPaymentTable = (paymentList, showDaysColumn = false, columnLabel = "Days Left") => (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Site Name</th>
            <th style={styles.th}>Account Name</th>
            <th style={styles.th}>Account Number</th>
            <th style={styles.th}>Due Date</th>
            <th style={styles.th}>Monthly Payment</th>
            {showDaysColumn && <th style={styles.th}>{columnLabel}</th>}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paymentList.map(payment => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const due = new Date(today.getFullYear(), today.getMonth(), payment.dueDate);
            due.setHours(0, 0, 0, 0);
            
            const days = Math.ceil((due - today) / 86400000);
            const daysOverdue = getDaysOverdue(payment);

            return (
              <tr key={payment.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(payment) }}></span>
                </td>
                <td style={styles.td}>{payment.siteName}</td>
                <td style={styles.td}>{payment.accountName}</td>
                <td style={styles.td}>{payment.accountNumber}</td>
                <td style={styles.td}>Day {payment.dueDate}</td>
                <td style={styles.td}>₱{payment.monthlyPayment.toLocaleString()}</td>
                {showDaysColumn && (
                  <td style={styles.td}>
                    {daysOverdue > 0 ? `${daysOverdue} days` : `${days} days`}
                  </td>
                )}
                <td style={styles.td}>
                  <button 
                    onClick={() => openPayBill(payment)}
                    style={styles.payBillButton}
                  >
                    Pay Bill
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setPhaseSummaryOpen(true)}
          style={{ ...styles.payBillButton, padding: '10px 20px', fontSize: '16px', background:'#10b981' }}
        >
          Weekly Summary
        </button>
      </div>

      {overduePayments.length > 0 && (
        <>
          <h2 style={{ ...styles.dashboardTitle, color: '#ef4444' }}>Overdue Payments</h2>
          {renderPaymentTable(overduePayments, true, "Days Overdue")}
        </>
      )}

      <h2 style={{ ...styles.dashboardTitle, marginTop: overduePayments.length > 0 ? '40px' : '0' }}>
        Due Less Than 7 Days
      </h2>
      {dueLessThan7Days.length === 0 ? (
        <p style={styles.noData}>No payments due within the next 7 days</p>
      ) : (
        renderPaymentTable(dueLessThan7Days, true, "Days Left")
      )}

      <h2 style={{ ...styles.dashboardTitle, marginTop: '40px' }}>Upcoming Unpaid Bills</h2>
      {upcomingUnpaidBills.length === 0 ? (
        <p style={styles.noData}>No upcoming unpaid bills</p>
      ) : (
        renderPaymentTable(upcomingUnpaidBills, false)
      )}

      <PayBillModal
        open={isPayModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setPayModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleConfirmPayment}
      />

      {isPhaseSummaryOpen && (
        <div style={{
          position:'fixed', top:85, left:0, right:0, bottom:0,
          background:'rgba(0,0,0,.5)', display:'flex',
          justifyContent:'center', alignItems:'center', zIndex:1000
        }}>
          <div style={{
            background:'white', padding:'30px', borderRadius:'8px',
            width:'90%', maxWidth:'900px', maxHeight:'80vh', overflow:'auto'
          }}>
            <div style={{
              display:'flex', justifyContent:'space-between',
              alignItems:'center', marginBottom:'20px'
            }}>
              <h2 style={{ margin:0, fontSize:'24px', color:'#1e293b' }}>
                Weekly Summary by Phase
              </h2>
              <button
                onClick={() => setPhaseSummaryOpen(false)}
                style={{ fontSize:'24px', border:'none', background:'none',
                         cursor:'pointer', color:'#64748b' }}
              >
                ×
              </button>
            </div>

            {calculatePhaseWeeklySummary().map(week => (
              <div key={week.label} style={{
                border:'1px solid #e2e8f0', borderRadius:'8px',
                padding:'20px', marginBottom:'25px'
              }}>
                <div style={{
                  display:'flex', justifyContent:'space-between',
                  paddingBottom:'10px', borderBottom:'2px solid #e2e8f0'
                }}>
                  <h3 style={{ margin:0, color:'#334155' }}>
                    {week.label} (Day {week.start}-{week.end})
                  </h3>
                  <button 
                    onClick={() => printPhaseWeek(week)}
                    style={{
                      background:'#10b981', color:'white',
                      border:'none', borderRadius:'6px',
                      padding:'8px 16px', cursor:'pointer'
                    }}
                  >
                    🖨️ Print
                  </button>
                </div>

                {Object.keys(week.phases).length === 0 && (
                  <p style={{ color:'#94a3b8', fontStyle:'italic' }}>
                    No bills for this week
                  </p>
                )}

                {Object.values(week.phases).map(phase => (
                  <div key={phase.phase} style={{
                    marginTop:'20px', padding:'15px',
                    border:'1px solid #f1f5f9', borderRadius:'6px'
                  }}>
                    <h4 style={{ margin:0, marginBottom:'8px', color:'#334155' }}>
                       {phase.phase} 
                    </h4>

                    {phase.bills.map(bill => (
                      <div key={bill.id} style={{
                        display:'flex', justifyContent:'space-between',
                        padding:'6px 0', borderBottom:'1px solid #f1f5f9'
                      }}>
                        <div>
                          <strong>{bill.siteName}</strong>
                          <span style={{ color:'#94a3b8', marginLeft:'10px' }}>
                            ({bill.accountName})
                          </span>
                        </div>
                        <div style={{ width:'200px', textAlign:'right'}}>
                          <span style={{ marginRight:'10px', color:'#64748b' }}>
                            Day {bill.dueDate}
                          </span>
                          <strong>₱{bill.monthlyPayment.toLocaleString()}</strong>
                        </div>
                        
                      </div>
                    ))}
                    <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <strong> Total: </strong> 
                      <span style={{ color:'#ef4444', fontWeight: 'bold', marginLeft: '5px' }}>
                         ₱{phase.total.toLocaleString()}
                      </span>
                      </div>
                  </div>
                  
                ))}
                 <div style={{ marginTop:'15px',textAlign: 'right' }}>
                  <strong>Total Amount (Weekly):</strong>
                  <span style={{
                    marginLeft:'10px', fontSize:'18px',
                    color:'#ef4444', fontWeight:'bold',
                  }}>
                    ₱{week.totalAllPhases.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <div style={{
              marginTop:'30px', padding:'20px', backgroundColor:'#f0fdf4',
              borderRadius:'8px', border:'2px solid #10b981'
            }}>
              <h3 style={{ margin:'0 0 15px 0', color:'#334155', fontSize:'20px' }}>
                Monthly Summary by Phase
              </h3>
              {(() => {
                const phaseTotals = {};
                let grandTotal = 0;

                calculatePhaseWeeklySummary().forEach(week => {
                  Object.values(week.phases).forEach(phase => {
                    if (!phaseTotals[phase.phase]) {
                      phaseTotals[phase.phase] = 0;
                    }
                    phaseTotals[phase.phase] += phase.total;
                  });
                  grandTotal += week.totalAllPhases;
                });

                return (
                  <>
                    {Object.entries(phaseTotals).map(([phase, total]) => (
                      <div key={phase} style={{
                        display:'flex', justifyContent:'space-between',
                        padding:'10px 0', borderBottom:'1px solid #d1fae5'
                      }}>
                        <span style={{ fontSize:'16px', color:'#334155', fontWeight:'500' }}>
                          {phase}
                        </span>
                        <span style={{ fontSize:'18px', color:'#ef4444', fontWeight:'600' }}>
                          ₱{total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div style={{
                      display:'flex', justifyContent:'space-between',
                      padding:'15px 0', marginTop:'10px',
                      borderTop:'2px solid #10b981'
                    }}>
                      <span style={{ fontSize:'18px', color:'#0f172a', fontWeight:'700' }}>
                        Grand Total (All Phases):
                      </span>
                      <span style={{ fontSize:'24px', color:'#ef4444', fontWeight:'700' }}>
                        ₱{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;