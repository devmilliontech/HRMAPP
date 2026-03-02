import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import moment from "moment";
import { months } from "../constants/data";

export const generatePayslipPDF = async ({ salaryData }) => {
  const logo = Asset.fromModule(require("../../assets/MillionHIts_Logo.png"));
  const logoAsset = await logo.downloadAsync();

  const employee = salaryData.user;

  const monthLabel =
    months.find((m) => m.value == salaryData.month)?.label +
    "-" +
    String(salaryData.year).slice(-2);

  const earningsRows = `
    <tr>
      <td>Basic Pay</td>
      <td class="right">${employee.baseSalary}</td>
    </tr>
    ${salaryData.allowances
      .map(
        (a) => `
        <tr>
          <td>${a.name}</td>
          <td class="right">${a.amount}</td>
        </tr>`
      )
      .join("")}
    <tr>
      <td class="bold">Total Earnings</td>
      <td class="right bold">${salaryData.grossSalary}</td>
    </tr>
  `;

  const deductionRows = `
    ${salaryData.deductions
      .map(
        (d) => `
        <tr>
          <td>${d.name}</td>
          <td class="right">${d.amount}</td>
        </tr>`
      )
      .join("")}
    <tr>
      <td class="bold">Total Deductions</td>
      <td class="right bold">${salaryData.totalDeduction}</td>
    </tr>
  `;

  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial;
          padding: 20px;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #000;
          padding: 6px;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .header-table td { border: none; }
        .no-border td { border: none; }
      </style>
    </head>

    <body>

      <!-- HEADER -->
      <table>
        <tr>
          <td colspan="3" class="center bold" style="font-size:16px;">
            MILLIONTECH PRIVATE LIMITED
          </td>
        </tr>
        <tr>
          <td rowspan="2" style="width:120px;">
            <img src="${logoAsset.uri}" width="100"/>
          </td>
          <td class="center bold">Salary Slip</td>
          <td rowspan="2" class="center bold">Confidential</td>
        </tr>
        <tr>
          <td class="center bold">${monthLabel}</td>
        </tr>
      </table>

      <!-- EMPLOYEE DETAILS -->
      <table>
        <tr>
          <td><b>Employee Name</b></td>
          <td>${employee.firstName} ${employee.lastName}</td>
          <td><b>Designation</b></td>
          <td>${employee.jobRole}</td>
        </tr>
        <tr>
          <td><b>Employee ID</b></td>
          <td>${employee.empId}</td>
          <td><b>T</b></td>
          <td>${employee.team}</td>
        </tr>
        <tr>
          <td><b>Joining Date</b></td>
          <td>${moment(employee.createdAt).format("Do MMM YYYY")}</td>
          <td><b>Location</b></td>
          <td>Kolkata</td>
        </tr>
      </table>

      <!-- EARNINGS & DEDUCTIONS -->
      <table>
        <tr>
          <th colspan="2" class="center">EARNINGS</th>
          <th colspan="2" class="center">DEDUCTIONS</th>
        </tr>
        <tr>
          <th>Description</th>
          <th class="right">Amount (Rs.)</th>
          <th>Description</th>
          <th class="right">Amount (Rs.)</th>
        </tr>

        <tr>
          <td colspan="2">
            <table style="width:100%; border-collapse: collapse;">
              ${earningsRows}
            </table>
          </td>

          <td colspan="2">
            <table style="width:100%; border-collapse: collapse;">
              ${deductionRows}
            </table>
          </td>
        </tr>
      </table>

      <!-- NET PAY -->
      <table>
        <tr>
          <td class="bold" style="font-size:14px;">
            NET PAY (Rs.)
          </td>
          <td class="right bold" style="font-size:14px;">
            ${salaryData.netSalary}
          </td>
        </tr>
      </table>

      <!-- FOOTER -->
      <div style="margin-top:40px; text-align:center; font-size:12px;">
        This Pay Slip is system generated.
      </div>

    </body>
  </html>
  `;

  const pdf = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(pdf.uri);
};
