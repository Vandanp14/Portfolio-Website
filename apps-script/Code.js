/**
 * Contact form backend for vandanpatel.me.
 *
 * Deployed as a Web App (executeAs: USER_DEPLOYING, access: ANYONE_ANONYMOUS)
 * so the site can POST to it anonymously while the mail is sent as, and to,
 * the deploying account.
 *
 * The browser posts JSON with Content-Type: text/plain so the request stays a
 * CORS "simple request" — Apps Script cannot answer a preflight OPTIONS, so a
 * JSON content type would fail before doPost ever runs.
 */

var CONFIG = {
  // Where the notification lands. Override without a redeploy by setting a
  // script property named RECIPIENT.
  recipient: 'patelvandan024@gmail.com',
  subjectPrefix: '[vandanpatel.me]',
  // Crude global flood guard: at most this many accepted messages per hour.
  maxPerHour: 40,
  minMessageLength: 20,
  maxFieldLength: 5000,
};

/** Health check — opening the deployment URL in a browser hits this. */
function doGet() {
  return json({ ok: true, service: 'contact', status: 'up' });
}

function doPost(e) {
  try {
    var body = parseBody(e);
    if (!body) return json({ ok: false, error: 'Could not read the request body.' });

    // Honeypot: real people never fill this in. Report success so a bot
    // cannot tell the difference between a drop and a delivery.
    if (String(body.company || '').trim() !== '') return json({ ok: true });

    var invalid = validate(body);
    if (invalid) return json({ ok: false, error: invalid });

    if (!withinRateLimit()) {
      return json({
        ok: false,
        error: 'Too many messages right now. Please email patelvandan024@gmail.com directly.',
      });
    }

    send(body);
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({
      ok: false,
      error: 'Something broke on my end. Please email patelvandan024@gmail.com directly.',
    });
  }
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return null;
  }
}

function validate(body) {
  var name = clean(body.name);
  var email = clean(body.email);
  var subject = clean(body.subject);
  var message = clean(body.message);

  if (!name) return 'Please include your name.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Please include a valid email address.';
  if (!subject) return 'Please include a subject.';
  if (message.length < CONFIG.minMessageLength) {
    return 'Please write at least ' + CONFIG.minMessageLength + ' characters.';
  }
  if (
    name.length > CONFIG.maxFieldLength ||
    subject.length > CONFIG.maxFieldLength ||
    message.length > CONFIG.maxFieldLength
  ) {
    return 'That message is too long to send from the form.';
  }
  return null;
}

/**
 * Rolling hourly counter in script properties. Apps Script gives web apps no
 * client IP, so this is a global cap rather than a per-sender one — enough to
 * stop a script from emptying the daily mail quota.
 */
function withinRateLimit() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return false;
  try {
    var props = PropertiesService.getScriptProperties();
    var hour = Math.floor(Date.now() / 3600000);
    var stored = props.getProperty('rate');
    var state = stored ? JSON.parse(stored) : { hour: hour, count: 0 };
    if (state.hour !== hour) state = { hour: hour, count: 0 };
    if (state.count >= CONFIG.maxPerHour) return false;
    state.count += 1;
    props.setProperty('rate', JSON.stringify(state));
    return true;
  } finally {
    lock.releaseLock();
  }
}

function send(body) {
  var props = PropertiesService.getScriptProperties();
  var recipient = props.getProperty('RECIPIENT') || CONFIG.recipient;

  var name = clean(body.name);
  var email = clean(body.email);
  var subject = clean(body.subject);
  var message = clean(body.message);
  var received = Utilities.formatDate(new Date(), CONFIG.timeZone || 'America/New_York', "yyyy-MM-dd 'at' HH:mm z");

  var plain = [
    'From:    ' + name + ' <' + email + '>',
    'Subject: ' + subject,
    'Sent:    ' + received,
    '',
    message,
  ].join('\n');

  MailApp.sendEmail({
    to: recipient,
    replyTo: email,
    subject: CONFIG.subjectPrefix + ' ' + subject,
    body: plain,
    htmlBody: htmlBody({ name: name, email: email, subject: subject, message: message, received: received }),
    name: 'vandanpatel.me',
  });
}

function htmlBody(data) {
  return [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:640px;color:#17161a">',
    '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#84828c">New message · vandanpatel.me</p>',
    '<h2 style="margin:0 0 20px;font-size:20px;font-weight:600">' + esc(data.subject) + '</h2>',
    '<table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">',
    row('From', esc(data.name)),
    row('Email', '<a href="mailto:' + esc(data.email) + '" style="color:#bf350d">' + esc(data.email) + '</a>'),
    row('Received', esc(data.received)),
    '</table>',
    '<div style="white-space:pre-wrap;line-height:1.65;font-size:15px;border-left:3px solid #bf350d;padding-left:16px">',
    esc(data.message),
    '</div>',
    '<p style="margin-top:24px;font-size:13px;color:#84828c">Reply directly to this email to answer ' + esc(data.name) + '.</p>',
    '</div>',
  ].join('');
}

function row(label, value) {
  return (
    '<tr><td style="padding:6px 16px 6px 0;color:#84828c;white-space:nowrap">' +
    label +
    '</td><td style="padding:6px 0">' +
    value +
    '</td></tr>'
  );
}

function clean(value) {
  return String(value == null ? '' : value).trim();
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
