import { jsPDF } from 'jspdf';
import { LessonPlan, LessonPage } from '../types';

export interface PdfExportOptions {
  includeObjectives: boolean;
  includeTasks: boolean;
  includeLinks: boolean;
  includeNotes: boolean;
}

export function generateLessonPdf(
  lesson: LessonPlan,
  pages: LessonPage[],
  options: PdfExportOptions = {
    includeObjectives: true,
    includeTasks: true,
    includeLinks: true,
    includeNotes: true,
  }
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const maxContentY = pageHeight - 20;

  let y = margin;
  let currentPageNum = 1;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > maxContentY) {
      addFooter();
      doc.addPage();
      currentPageNum++;
      y = margin;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${lesson.title || 'Lesson Plan'} • ${lesson.date || ''}`,
      margin,
      y
    );
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;
  };

  const addFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text(
      'LessonFlow',
      margin,
      pageHeight - 7
    );
    doc.text(
      `Page ${currentPageNum}`,
      pageWidth - margin - 12,
      pageHeight - 7
    );
  };

  // Process each screen
  pages.forEach((pg, pageIdx) => {
    if (pageIdx > 0) {
      checkPageBreak(80);
    }

    // Screen Header Banner
    checkPageBreak(30);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'S');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    const titleLines = doc.splitTextToSize(lesson.title || "Today's Lesson", contentWidth - 40);
    doc.text(titleLines[0], margin + 4, y + 8);

    // Subtitle / Screen title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(2, 132, 199);
    doc.text(pg.title || `Screen ${pageIdx + 1}`, margin + 4, y + 15);

    // Date & Screen Info (Right side)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(lesson.date || '', pageWidth - margin - 4, y + 8, { align: 'right' });
    doc.text(`Screen ${pageIdx + 1} of ${pages.length}`, pageWidth - margin - 4, y + 15, {
      align: 'right',
    });

    y += 30;

    // 1. Objectives & Aims
    if (options.includeObjectives) {
      const hasObjectives = pg.lessonObjectives && pg.lessonObjectives.length > 0;
      const hasAims = pg.competenceAims && pg.competenceAims.length > 0;

      if (hasObjectives || hasAims) {
        checkPageBreak(25);

        if (hasObjectives) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(3, 105, 161);
          doc.text('LESSON OBJECTIVES', margin, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);

          pg.lessonObjectives.forEach((obj, idx) => {
            const lines = doc.splitTextToSize(`${idx + 1}.  ${obj}`, contentWidth - 4);
            checkPageBreak(lines.length * 4.5 + 2);
            doc.text(lines, margin + 2, y);
            y += lines.length * 4.5 + 1.5;
          });

          y += 4;
        }

        if (hasAims) {
          checkPageBreak(20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(67, 56, 202);
          doc.text('COMPETENCE STANDARDS & AIMS', margin, y);
          y += 5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);

          pg.competenceAims.forEach((aim, idx) => {
            const lines = doc.splitTextToSize(`•   ${aim}`, contentWidth - 4);
            checkPageBreak(lines.length * 4.5 + 2);
            doc.text(lines, margin + 2, y);
            y += lines.length * 4.5 + 1.5;
          });

          y += 4;
        }
      }
    }

    // 2. Tasks & Activities
    if (options.includeTasks && pg.tasks && pg.tasks.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(67, 56, 202);
      doc.text(`CLASS TASKS & CHECKLIST (${pg.tasks.length})`, margin, y);
      y += 6;

      pg.tasks.forEach((tsk) => {
        const textLines = doc.splitTextToSize(tsk.text, contentWidth - 12);
        const itemHeight = Math.max(7, textLines.length * 4.5 + 2);
        checkPageBreak(itemHeight);

        // Checkbox square
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(0.4);
        doc.rect(margin + 2, y, 4, 4);

        if (tsk.completed) {
          doc.setDrawColor(16, 185, 129);
          doc.setLineWidth(0.6);
          doc.line(margin + 2.5, y + 2, margin + 3.5, y + 3.5);
          doc.line(margin + 3.5, y + 3.5, margin + 5.5, y + 0.8);
        }

        // Task text
        doc.setFont('helvetica', tsk.completed ? 'normal' : 'bold');
        doc.setFontSize(9);
        doc.setTextColor(tsk.completed ? 148 : 30, tsk.completed ? 163 : 41, tsk.completed ? 184 : 59);
        doc.text(textLines, margin + 9, y + 3.2);

        y += itemHeight + 1.5;
      });

      y += 4;
    }

    // 3. Links & Resources
    if (options.includeLinks && pg.links && pg.links.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text('CLASSROOM LINKS & RESOURCES', margin, y);
      y += 6;

      pg.links.forEach((lnk) => {
        checkPageBreak(12);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(lnk.title || 'Resource Link', margin + 3, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(2, 132, 199);
        doc.text(lnk.url, margin + 3, y + 8);

        y += 12;
      });

      y += 4;
    }

    // 4. Notes & Instructions
    if (options.includeNotes && pg.textAndImage?.text) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 64, 175);
      doc.text('LESSON NOTES & INSTRUCTIONS', margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      const noteLines = doc.splitTextToSize(pg.textAndImage.text, contentWidth - 4);
      noteLines.forEach((line: string) => {
        checkPageBreak(4.5);
        doc.text(line, margin + 2, y);
        y += 4.5;
      });

      y += 6;
    }

    // Separator line between screens if multiple
    if (pageIdx < pages.length - 1) {
      checkPageBreak(10);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
  });

  addFooter();
  return doc;
}

export function generateLessonPdfBlob(
  lesson: LessonPlan,
  pages: LessonPage[],
  options?: PdfExportOptions
): { blob: Blob; blobUrl: string; filename: string } {
  const doc = generateLessonPdf(lesson, pages, options);
  const safeTitle = (lesson.title || 'Lesson_Plan')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const scopeSuffix = pages.length === 1 ? `_${(pages[0]?.title || 'Screen').replace(/\s+/g, '_')}` : '_All_Screens';
  const filename = `LessonFlow_${safeTitle}${scopeSuffix}.pdf`;
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  return { blob, blobUrl, filename };
}

export function downloadLessonPdf(
  lesson: LessonPlan,
  pages: LessonPage[],
  options?: PdfExportOptions
): { success: boolean; filename: string; blobUrl?: string } {
  const doc = generateLessonPdf(lesson, pages, options);
  const safeTitle = (lesson.title || 'Lesson_Plan')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const scopeSuffix = pages.length === 1 ? `_${(pages[0]?.title || 'Screen').replace(/\s+/g, '_')}` : '_All_Screens';
  const filename = `LessonFlow_${safeTitle}${scopeSuffix}.pdf`;

  try {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Primary: Standard anchor trigger with download attribute
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 1500);

    return { success: true, filename, blobUrl };
  } catch (err) {
    console.warn('Anchor blob download failed, falling back to doc.save():', err);
    try {
      doc.save(filename);
      return { success: true, filename };
    } catch (saveErr) {
      console.error('All PDF download strategies failed:', saveErr);
      throw saveErr;
    }
  }
}

export function printLessonViaIframe(
  lesson: LessonPlan,
  pages: LessonPage[],
  options: PdfExportOptions = {
    includeObjectives: true,
    includeTasks: true,
    includeLinks: true,
    includeNotes: true,
  }
): { triggered: boolean; message?: string } {
  // Build pristine standalone HTML with standard universal CSS
  let contentHtml = '';

  pages.forEach((pg, idx) => {
    contentHtml += `
      <div style="page-break-after: ${idx < pages.length - 1 ? 'always' : 'auto'}; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px;">
          <div>
            <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 4px 0; color: #0f172a;">${lesson.title || "Today's Lesson"}</h1>
            <h2 style="font-size: 14px; font-weight: 700; margin: 0; color: #0284c7;">${pg.title || `Screen ${idx + 1}`}</h2>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>${lesson.date || ''}</div>
            <div>Screen ${idx + 1} of ${pages.length}</div>
          </div>
        </div>
    `;

    if (options.includeObjectives) {
      if (pg.lessonObjectives && pg.lessonObjectives.length > 0) {
        contentHtml += `
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0369a1; margin-bottom: 6px; letter-spacing: 0.05em;">Lesson Objectives</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155; line-height: 1.6;">
              ${pg.lessonObjectives.map((obj) => `<li>${obj}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      if (pg.competenceAims && pg.competenceAims.length > 0) {
        contentHtml += `
          <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #5b21b6; margin-bottom: 6px; letter-spacing: 0.05em;">Competence Standards & Aims</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155; line-height: 1.6;">
              ${pg.competenceAims.map((aim) => `<li>${aim}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    if (options.includeTasks && pg.tasks && pg.tasks.length > 0) {
      contentHtml += `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4338ca; margin-bottom: 10px; letter-spacing: 0.05em;">Class Tasks & Checklist (${pg.tasks.length})</div>
          <div>
            ${pg.tasks
              .map(
                (tsk) => `
                <div style="display: flex; align-items: center; gap: 10px; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                  <span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid ${tsk.completed ? '#10b981' : '#64748b'}; border-radius: 3px; background: ${tsk.completed ? '#ecfdf5' : 'transparent'}; text-align: center; line-height: 12px; font-size: 10px; color: #10b981;">${tsk.completed ? '✓' : ''}</span>
                  <span style="color: ${tsk.completed ? '#94a3b8' : '#1e293b'}; ${tsk.completed ? 'text-decoration: line-through;' : 'font-weight: 600;'}">${tsk.text}</span>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    if (options.includeLinks && pg.links && pg.links.length > 0) {
      contentHtml += `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #059669; margin-bottom: 8px; letter-spacing: 0.05em;">Classroom Links & Resources</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
            ${pg.links
              .map(
                (lnk) => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 11px;">
                  <div style="font-weight: bold; color: #1e293b; margin-bottom: 2px;">${lnk.title}</div>
                  <div style="color: #0284c7; word-break: break-all;">${lnk.url}</div>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    if (options.includeNotes && pg.textAndImage?.text) {
      contentHtml += `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1e40af; margin-bottom: 6px; letter-spacing: 0.05em;">Lesson Notes & Instructions</div>
          <div style="font-size: 11px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${pg.textAndImage.text}</div>
        </div>
      `;
    }

    contentHtml += `</div>`;
  });

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${lesson.title || 'Lesson Plan'}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          *, *:before, *:after {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 12px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${contentHtml}
        <script>
          window.onload = function() {
            window.focus();
            try {
              window.print();
            } catch(e) {
              console.warn("Print error in frame:", e);
            }
          };
        </script>
      </body>
    </html>
  `;

  // Create real off-screen iframe
  const existingFrame = document.getElementById('lesson-print-iframe');
  if (existingFrame) existingFrame.remove();

  const printFrame = document.createElement('iframe');
  printFrame.id = 'lesson-print-iframe';
  printFrame.style.position = 'fixed';
  printFrame.style.left = '-9999px';
  printFrame.style.top = '0';
  printFrame.style.width = '1024px';
  printFrame.style.height = '1000px';
  printFrame.style.opacity = '0.01';
  printFrame.style.border = 'none';
  printFrame.style.zIndex = '-1';
  document.body.appendChild(printFrame);

  try {
    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(fullHtml);
      frameDoc.close();

      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (err) {
          console.warn('Iframe print error:', err);
        }
      }, 350);

      return { triggered: true };
    }
  } catch (err) {
    console.warn('Could not write to print iframe:', err);
  }

  // Fallback: window.print()
  try {
    window.print();
    return { triggered: true };
  } catch {
    return { triggered: false, message: 'Print blocked by browser environment' };
  }
}
