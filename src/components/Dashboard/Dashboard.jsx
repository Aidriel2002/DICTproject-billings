import React, { useState } from 'react';
import { getStatusColor, getDaysOverdue, isCoveredByAdvancePayment } from '../../utils/statusHelper';
import { PayBillModal } from '../Payments/PayBillModal';
import { styles } from '../../styles/dashboardStyles';

export const Dashboard = ({ payments, onUpdate, onAddHistory }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPayModalOpen, setPayModalOpen] = useState(false);
  const [isWeeklySummaryOpen, setWeeklySummaryOpen] = useState(false);

  // NEW STATE
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

  // ORIGINAL WEEK SUMMARY
  const calculateWeeklySummary = () => {
    const weeks = [
      { label: 'Week 1', start: 1, end: 7, bills: [], total: 0 },
      { label: 'Week 2', start: 8, end: 14, bills: [], total: 0 },
      { label: 'Week 3', start: 15, end: 21, bills: [], total: 0 },
      { label: 'Week 4', start: 22, end: 31, bills: [], total: 0 }
    ];

    const unpaidBills = payments.filter(p => {
      if (isCoveredByAdvancePayment(p)) return false;
      if (p.remarks === 'Paid') return false;
      return true;
    }).sort((a, b) => a.dueDate - b.dueDate);

    const processed = new Set();

    weeks.forEach(week => {
      unpaidBills.forEach(b => {
        if (processed.has(b.id)) return;
        if (b.dueDate >= week.start && b.dueDate <= week.end) {
          week.bills.push(b);
          week.total += b.monthlyPayment;
          processed.add(b.id);
        }
      });

      unpaidBills.forEach(b => {
        if (!processed.has(b.id) && b.dueDate < week.start) {
          week.bills.push(b);
          week.total += b.monthlyPayment;
        }
      });

      week.bills.sort((a, b) => a.dueDate - b.dueDate);
    });

    return weeks;
  };

  // ⭐ NEW: WEEKLY SUMMARY BY PHASE
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
      phases: {}, // phase groups
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
          body { font-family: Arial; padding: 20px; color: #1e293b; }
          h1 { border-bottom: 3px solid #e2e8f0; padding-bottom: 10px; }
          h2 { margin-top: 20px; color:#334155; }
          table { width:100%; border-collapse:collapse; margin-top:10px; }
          th { background:#334155; color:white; padding:8px; text-align:left; }
          td { border-bottom: 1px solid #e2e8f0; padding:6px; }
          .amount { text-align:right; }
        </style>
      </head>
      <body>

        <h1>${week.label} - Phase Breakdown</h1>
        <p><b>Period:</b> Day ${week.start} - Day ${week.end} <br>
        <b>Total (All Phases):</b> ₱${week.totalAllPhases.toLocaleString()}</p>

        ${Object.keys(week.phases).length === 0 ? `
          <p>No bills for this week</p>
        ` : `
          ${Object.values(week.phases).map(ph => `
            <h2> ${ph.phase} — Total: ₱${ph.total.toLocaleString()}</h2>
            <table>
              <thead>
                <tr>
                  <th>Site</th><th>Account</th><th>Number</th><th>Due</th><th class="amount">Amount</th>
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
          `).join("")}
        `}

        <p style="margin-top:20px;font-size:12px;color:#64748b;">
          Printed on: ${new Date().toLocaleString()}
        </p>

      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

    const printWeek = (week) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const today = new Date();
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${week.label} Bill Summary - ${monthYear}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #1e293b;
            }
            h1 {
              color: #334155;
              border-bottom: 3px solid #e2e8f0;
              padding-bottom: 10px;
            }
            h2 {
              color: #475569;
              margin-top: 20px;
            }
            .summary-info {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .total {
              font-size: 24px;
              font-weight: bold;
              color: #ef4444;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #334155;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .amount {
              text-align: right;
              font-weight: 500;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              font-size: 12px;
              color: #64748b;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${week.label} Bill Summary</h1>
          <div class="summary-info">
            <strong>Period:</strong> Day ${week.start} - Day ${week.end}<br>
            <strong>Month:</strong> ${monthYear}<br>
            <div class="total">Total Amount: ₱${week.total.toLocaleString()}</div>
          </div>
          
          ${week.bills.length > 0 ? `
            <h2>Bills (${week.bills.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Account Name</th>
                  <th>Account Number</th>
                  <th>Due Date</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${week.bills.map(bill => `
                  <tr>
                    <td>${bill.siteName}</td>
                    <td>${bill.accountName}</td>
                    <td>${bill.accountNumber}</td>
                    <td>Day ${bill.dueDate}</td>
                    <td class="amount">₱${bill.monthlyPayment.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <p style="color: #94a3b8; font-style: italic;">No bills for this week</p>
          `}
          
          <div class="footer">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };


  // ---------------------------- UI TABLE FUNCTION ----------------------------
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
      <div style={{ display: 'flex' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setWeeklySummaryOpen(true)}
          style={{ ...styles.payBillButton, padding: '10px 20px', fontSize: '16px', marginRight: '20px' }}
        >
          View Weekly Bill Summary
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setPhaseSummaryOpen(true)}
          style={{ ...styles.payBillButton, padding: '10px 20px', fontSize: '16px', background:'#10b981' }}
        >
          View Weekly Summary by Phase
        </button>
      </div>
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

      {/* PAY MODAL */}
      <PayBillModal
        open={isPayModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setPayModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdate={handleConfirmPayment}
      />

      {/* ORIGINAL WEEK SUMMARY MODAL */}
      {isWeeklySummaryOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '8px',
            padding: '30px', maxWidth: '900px', width: '90%',
            maxHeight: '80vh', overflow: 'auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>

            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>
                Weekly Bill Summary
              </h2>

              <button 
                onClick={() => setWeeklySummaryOpen(false)}
                style={{ background:'none', border:'none', fontSize:'24px',
                         cursor:'pointer', color:'#64748b' }}
              >
                ×
              </button>
            </div>

            {calculateWeeklySummary().map(week => (
              <div key={week.label} style={{
                marginBottom:'30px', border:'1px solid #e2e8f0',
                borderRadius:'8px', padding:'20px'
              }}>
                <div style={{
                  display:'flex', justifyContent:'space-between',
                  alignItems:'center', marginBottom:'15px',
                  paddingBottom:'10px', borderBottom:'2px solid #e2e8f0'
                }}>
                  <h3 style={{ margin:0, fontSize:'18px', color:'#334155' }}>
                    {week.label} (Day {week.start}-{week.end})
                  </h3>

                  <div style={{ display:'flex', alignItems:'center', gap:'15px' }}>
                    <div style={{
                      fontSize:'20px', fontWeight:'bold',
                      color: week.total > 0 ? '#ef4444' : '#10b981'
                    }}>
                      Total: ₱{week.total.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => printWeek(week)}
                      style={{
                        backgroundColor:'#3b82f6', color:'white',
                        border:'none', borderRadius:'6px',
                        padding:'8px 16px', cursor:'pointer',
                        fontSize:'14px', fontWeight:'500'
                      }}
                    >
                      🖨️ Print
                    </button>
                  </div>
                </div>

                {week.bills.length > 0 ? (
                  <div style={{ fontSize:'14px' }}>
                    {week.bills.map(bill => (
                      <div key={bill.id} style={{
                        display:'flex', justifyContent:'space-between',
                        padding:'8px 0',
                        borderBottom:'1px solid #f1f5f9'
                      }}>
                        <div style={{ flex:1 }}>
                          <span style={{ fontWeight:'500', color:'#475569' }}>
                            {bill.siteName}
                          </span>
                          <span style={{ color:'#94a3b8', marginLeft:'10px' }}>
                            ({bill.accountName})
                          </span>
                        </div>

                        <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
                          <span style={{ color:'#64748b', fontSize:'13px' }}>
                            Due: Day {bill.dueDate}
                          </span>
                          <span style={{
                            fontWeight:'500', color:'#1e293b',
                            minWidth:'100px', textAlign:'right'
                          }}>
                            ₱{bill.monthlyPayment.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color:'#94a3b8', fontStyle:'italic', margin:0 }}>
                    No bills for this week
                  </p>
                )}
              </div>
            ))}

            <div style={{
              marginTop:'20px', padding:'15px', backgroundColor:'#f8fafc',
              borderRadius:'8px', display:'flex', justifyContent:'space-between'
            }}>
              <span style={{ fontSize:'18px', fontWeight:'600', color:'#334155' }}>
                Monthly Total (Unpaid):
              </span>
              <span style={{
                fontSize:'24px', fontWeight:'bold', color:'#ef4444'
              }}>
                ₱{payments.filter(p => {
                  if (isCoveredByAdvancePayment(p)) return false;
                  if (p.remarks === 'Paid') return false;
                  return true;
                }).reduce((sum, bill) => sum + bill.monthlyPayment, 0).toLocaleString()}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ⭐ NEW: WEEKLY SUMMARY BY PHASE MODAL */}
      {isPhaseSummaryOpen && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0,
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

                <div style={{ marginTop:'15px' }}>
                  <strong>Total (All Phases):</strong>
                  <span style={{
                    marginLeft:'10px', fontSize:'18px',
                    color:'#ef4444', fontWeight:'bold'
                  }}>
                    ₱{week.totalAllPhases.toLocaleString()}
                  </span>
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
                       {phase.phase} — Total: 
                      <span style={{ color:'#ef4444', marginLeft:'5px' }}>
                        ₱{phase.total.toLocaleString()}
                      </span>
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

                        <div style={{ width:'200px', textAlign:'right' }}>
                          <span style={{ marginRight:'10px', color:'#64748b' }}>
                            Day {bill.dueDate}
                          </span>
                          <strong>₱{bill.monthlyPayment.toLocaleString()}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
