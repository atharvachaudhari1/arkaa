  /**
  * ARKAA Forms → Google Sheet
  * Deploy as Web app (Execute as: Me, Who has access: Anyone)
  * Sheet: https://docs.google.com/spreadsheets/d/1RRdcV1jDcyutzmClKI4_FJ_MIxRON62v72mZGS2Lz6U/edit?usp=sharing
  */
  function doGet() {
    return ContentService.createTextOutput(
      '<!DOCTYPE html><html><body><p>ARKAA form endpoint. Submit from the website form.</p></body></html>'
    ).setMimeType(ContentService.MimeType.HTML);
  }

  function doPost(e) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var p = {};
      if (e.postData && e.postData.contents) {
        var body = e.postData.contents;
        var pairs = body.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var parts = pairs[i].split('=');
          if (parts.length >= 2) {
            var key = decodeURIComponent(parts[0].replace(/\+/g, ' '));
            var val = decodeURIComponent((parts.slice(1).join('=')).replace(/\+/g, ' '));
            p[key] = val;
          }
        }
      }
      if (Object.keys(p).length === 0) { p = e.parameter || {}; }
      var formType = p.formType || (p.userName ? 'Work with Us' : (p.name ? 'Get in Touch' : 'Unknown'));
      var row;

      if (formType === 'Work with Us') {
        row = [
          new Date(),
          formType,
          p.userName || '',
          p.userEmail || '',
          p.projectType || '',
          p.organisation || '',
          (p.message || '').replace(/\n/g, ' ')
        ];
      } else {
        row = [
          new Date(),
          formType,
          p.name || '',
          p.email || '',
          '',
          '',
          (p.message || '').replace(/\n/g, ' ')
        ];
      }

      sheet.appendRow(row);
      return ContentService.createTextOutput('<script>window.parent.postMessage({ arkaaForm: true, success: true }, "*");</script>')
        .setMimeType(ContentService.MimeType.HTML);
    } catch (err) {
      return ContentService.createTextOutput('<script>window.parent.postMessage({ arkaaForm: true, success: false }, "*");</script>')
        .setMimeType(ContentService.MimeType.HTML);
    }
  }
