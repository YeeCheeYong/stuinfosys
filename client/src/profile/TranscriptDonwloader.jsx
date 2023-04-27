import React from 'react';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = () => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  // Define columns and rows for the table
  const columns = ['ID', 'Name', 'Age', 'City'];
  const rows = [
    [1, 'John Doe', 25, 'New York'],
    [2, 'Jane Smith', 30, 'Los Angeles'],
    [3, 'Bob Johnson', 35, 'Chicago'],
    [4, 'Alice Brown', 28, 'San Francisco'],
  ];
  // Add the table to the PDF document
  doc.autoTable({ columns, body: rows });
  doc.save('table.pdf');
};

const generateTranscript = (
  studentName,
  studentEmail,
  transcriptData,
  totalCredit,
  completedCredit,
  gpa,
  currentDate
) => {
  const doc = new jsPDF();
  // Set formal font for student name and email

  const header = 'Transcript';
  doc.setFont('times', 'bold');
  doc.setFontSize(20);

  // Center align student name and email
  const pageWidth = doc.internal.pageSize.getWidth();

  const textWidth0 =
    (doc.getStringUnitWidth(header) * doc.getFontSize()) /
    doc.internal.scaleFactor;
  const startX0 = (pageWidth - textWidth0) / 2;
  doc.text(startX0, 20, header);

  doc.setFont('times', 'bold');
  doc.setFontSize(16);

  // Center align student name and email
  //   const pageWidth = doc.internal.pageSize.getWidth();

  const textWidth1 =
    (doc.getStringUnitWidth(studentName) * doc.getFontSize()) /
    doc.internal.scaleFactor;
  const startX1 = (pageWidth - textWidth1) / 2;
  doc.text(startX1, 30, studentName);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  const textWidth2 =
    (doc.getStringUnitWidth(studentEmail) * doc.getFontSize()) /
    doc.internal.scaleFactor;
  const startX2 = (pageWidth - textWidth2) / 2;
  doc.text(startX2, 38, studentEmail);

  const columns = ['Course Code', 'Course Name', 'Credit', 'Grade'];
  const rows = transcriptData.map((course) => [
    course.courseCode,
    course.courseName,
    course.credit,
    course.grade,
  ]);
  doc.autoTable({
    columns,
    body: rows,
    margin: { top: 40 },
    startY: 45,
    theme: 'grid',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  //   doc.text(
  //     'Total Credit: ' + totalCredit,
  //     15,
  //     doc.autoTable.previous.finalY + 10
  //   );
  doc.text(
    'Completed Credit: ' + completedCredit,
    15,
    doc.autoTable.previous.finalY + 15
  );
  doc.text('GPA: ' + gpa.toFixed(2), 15, doc.autoTable.previous.finalY + 20);
  doc.text('Date: ' + currentDate, 15, doc.autoTable.previous.finalY + 25);

  doc.save('transcript.pdf');
};

const DownloadTranscript = (user) => {
  const studentName = user.first_name + ' ' + user.last_name;
  const emaailAddress = user.email;
  const transcriptData = [];
  const transcriptArray = user.transcript_grades;
  const firstString = transcriptArray[0].split(':');
  const totalCredit = parseFloat(firstString[0]);
  const completedCredit = parseFloat(firstString[1]);
  const gpa = parseFloat(firstString[2]);
  const date = new Date(parseInt(firstString[3])).toLocaleDateString();
  // Iterate through the remaining strings and extract grade details
  for (let i = 1; i < transcriptArray.length; i++) {
    const gradeString = transcriptArray[i].split(':');
    const courseCode = gradeString[0];
    const courseName = gradeString[1];
    const credit = parseFloat(gradeString[2]);
    const grade = parseFloat(gradeString[3]);
    transcriptData.push({ courseCode, courseName, credit, grade });
  }

  //make table

  generateTranscript(
    studentName,
    emaailAddress,
    transcriptData,
    totalCredit,
    completedCredit,
    gpa,
    date
  );
};

export default DownloadTranscript;
