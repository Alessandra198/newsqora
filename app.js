/* Newsqora marketing site — vanilla re-implementation of the design handoff.
   Three routes (/, /privacy, /terms), theme toggle, scroll-spy nav.
   No build step; deploys directly to GitHub Pages. */
(function () {
  'use strict';

  // ---- Constants & content ----------------------------------------------
  var EMAIL = ['newsqora', 'gmail.com'].join('@'); // joined to dodge scanners
  var BETA_HREF = 'mailto:' + EMAIL + '?subject=Newsqora%20beta%20access';
  var MAIL_HREF = 'mailto:' + EMAIL;

  var SECTIONS = ['top', 'how', 'trust', 'perspectives', 'follow'];
  var NAV = [
    { id: 'top', label: 'Home', href: '/#top' },
    { id: 'how', label: 'How it works', href: '/#how' },
    { id: 'trust', label: 'Why trust it', href: '/#trust' },
    { id: 'perspectives', label: 'Perspectives', href: '/#perspectives' },
    { id: 'follow', label: 'Follow us', href: '/#follow' }
  ];

  var DEMO_SOURCES = [
    { dot: 'var(--c-trust)', title: 'National wire service, policy desk', meta: 'Reported · 2 days ago' },
    { dot: 'var(--c-caution)', title: 'Official government register', meta: 'Primary document · undated entry' },
    { dot: 'var(--c-disputed)', title: 'Regional outlet, opinion section', meta: 'Commentary · 1 week ago' }
  ];

  var STEPS = [
    { n: '1', title: 'Bring a claim, link, or screenshot', body: 'Paste a claim, share a link, or capture a screenshot. Text inside images is read on your device; the image itself is never uploaded.' },
    { n: '2', title: 'She reads real sources', body: 'Newsqora consults verifiable sources and weighs what they actually say: who reported it, when, and where, without inserting an opinion.' },
    { n: '3', title: 'Graded confidence, fully cited', body: 'You receive a confidence grade with every source listed and linked, so you can check the reasoning yourself rather than take it on faith.' }
  ];

  var CHIPS = [
    { label: 'Well supported', fg: 'var(--c-trust)', bg: 'var(--c-trust-bg)' },
    { label: 'Caution', fg: 'var(--c-caution)', bg: 'var(--c-caution-bg)' },
    { label: 'Disputed', fg: 'var(--c-disputed)', bg: 'var(--c-disputed-bg)' },
    { label: 'Unverified', fg: 'var(--c-unverified)', bg: 'var(--c-unverified-bg)' }
  ];

  var PROMISES = ['Screenshots never leave your device', 'No ads, no tracking', 'Analytics is opt-in, never required'];

  var PILLARS = [
    { tag: 'Sourced', title: 'Every answer is cited', body: 'Nothing is asserted without a source behind it. Each citation names who said it, when, and where, with a link to follow.' },
    { tag: 'Neutral', title: 'No opinions, no positions', body: 'Newsqora gives no opinions and takes no political or religious positions. Contested topics are presented from each side with equal weight.' },
    { tag: 'Private', title: 'Your work, kept for you', body: 'Beta access uses Google sign-in so your investigations save to folders, your history syncs across devices, and support is possible. Screenshots are read on your device and never uploaded; only the claim you choose to check is sent for analysis, in the EU.' },
    { tag: 'Honest', title: 'Admits its limits', body: 'When verified sources are insufficient, she says so plainly rather than guessing or filling the gap with invention.' }
  ];

  var SOCIALS = [
    { name: 'Instagram', href: 'https://www.instagram.com/newsqora', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { name: 'X', href: 'https://x.com/Newsqora', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590447247208', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/120654032', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@newsqora', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { name: 'YouTube', href: 'https://www.youtube.com/@Newsqora-com', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
  ];

  var PRIVACY = [
    { h: 'Status of this document', body: '<p style="margin:0">This Privacy Policy is a working <strong style="color:var(--ink)">draft prepared for legal review</strong> and is not yet a final legal agreement. It describes, under the EU General Data Protection Regulation (GDPR), how Newsqora processes data. Items shown in [SQUARE BRACKETS] are placeholders for legal counsel to confirm.</p>' },
    { h: 'Data controller', body: '<p style="margin:0 0 12px">Newsqora is currently operated by an <strong style="color:var(--ink)">individual founder based in Spain</strong>, not yet a registered company. The data controller responsible for the processing described here is that individual: <strong style="color:var(--ink)">[CONTROLLER NAME]</strong> (&ldquo;Newsqora&rdquo;, &ldquo;we&rdquo;), operator of the Newsqora application and of newsqora.com. The GDPR applies in full notwithstanding that the controller is an individual rather than a company.</p><p style="margin:0">Contact for data-protection matters: <strong style="color:var(--ink)">[CONTROLLER CONTACT: email + postal address]</strong>. General enquiries may also be sent to <a href="mailto:newsqora@gmail.com" style="color:var(--accent)">newsqora@gmail.com</a>.</p>' },
    { h: 'Privacy by design', body: '<p style="margin:0 0 12px">Newsqora is built to collect only what the service genuinely needs. <strong style="color:var(--ink)">During the beta, signing in with Google is required to use Newsqora</strong>: an account is necessary to save your investigations to folders, keep your history, sync across your devices, and let us provide support. Through Google sign-in we receive your <strong style="color:var(--ink)">name, email address, and profile photo</strong>.</p><p style="margin:0">Separately, screenshots are processed on your device and are never uploaded, and any usage analytics is <strong style="color:var(--ink)">optional and opt-in</strong>; see Analytics below.</p>' },
    { h: 'Categories of data we process', body: '<p style="margin:0 0 12px">During the beta, signing in is required, so we process:</p><ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:9px"><li><strong style="color:var(--ink)">Account identity.</strong> Through Google sign-in we receive your name, email address, and profile photo, together with sign-in timestamps, to identify your account.</li><li><strong style="color:var(--ink)">The claim or text you submit.</strong> The wording you choose to fact-check, sent for analysis to produce a sourced answer.</li><li><strong style="color:var(--ink)">Saved investigations.</strong> Verifications and folders you choose to save, stored under your account.</li><li><strong style="color:var(--ink)">Anonymous usage analytics.</strong> Privacy-preserving, aggregate usage statistics with no advertising identifiers, processed <strong style="color:var(--ink)">only if you give separate, optional consent</strong> (see Analytics below). Declining analytics does not affect your use of the app.</li></ul>' },
    { h: 'Purposes and legal bases', body: '<p style="margin:0 0 12px">We process each category for a specific purpose and on a specific legal basis under Article 6 GDPR:</p><ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:9px"><li><strong style="color:var(--ink)">Providing the service</strong> (Google sign-in, processing your submitted claim, storing and syncing your saved investigations): <strong style="color:var(--ink)">performance of our agreement with you</strong> (Art. 6(1)(b)). An account is necessary to deliver these features during the beta.</li><li><strong style="color:var(--ink)">Usage analytics:</strong> your <strong style="color:var(--ink)">separate, optional consent</strong> (Art. 6(1)(a)). This is never bundled with sign-in; you may decline it and still use the app, and withdraw it at any time.</li><li><strong style="color:var(--ink)">Security and abuse prevention:</strong> our legitimate interest in keeping the service safe and reliable (Art. 6(1)(f)).</li></ul>' },
    { h: 'Analytics and consent', body: '<p style="margin:0">Any analytics used in the app is privacy-preserving and aggregate, and uses <strong style="color:var(--ink)">no advertising identifiers</strong>. It is enabled <strong style="color:var(--ink)">only after you give consent</strong>, never by default. You may withdraw consent at any time in the app settings, after which no further non-essential analytics is collected. The marketing website newsqora.com sets no cookies and uses no third-party trackers.</p>' },
    { h: 'On-device processing of screenshots', body: '<p style="margin:0">When you check a screenshot, the text is read from the image (OCR) <strong style="color:var(--ink)">entirely on your device</strong>. The image itself is <strong style="color:var(--ink)">never uploaded</strong> to us or to any third party. Only the resulting claim or text that you choose to verify leaves your device.</p>' },
    { h: 'AI processing of your query', body: '<p style="margin:0">To produce a sourced answer, the text you submit is processed by Google&rsquo;s Gemini models on Vertex AI. This is used solely to retrieve and summarise real sources and to generate the graded response. <strong style="color:var(--ink)">Your submissions are not used to train AI models</strong>, and are not used to build an advertising profile of you.</p>' },
    { h: 'Processors and sub-processors', body: '<p style="margin:0 0 12px">We use the following processors, who process data on our behalf under data-processing terms:</p><ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:7px"><li><strong style="color:var(--ink)">Google Cloud / Firebase (EU, Belgium)</strong>: hosting, database, and the back-end service that stores saved investigations.</li><li><strong style="color:var(--ink)">Google Vertex AI (EU)</strong>: processing of the submitted claim with Gemini to generate a sourced answer.</li><li><strong style="color:var(--ink)">Google authentication service (United States)</strong>: account identity and sign-in, under EU Standard Contractual Clauses.</li></ul>' },
    { h: 'Where we process your data, and international transfers', body: '<p style="margin:0 0 12px">We are deliberately precise about where your data is processed, and we do not claim that everything stays in the EU.</p><p style="margin:0 0 12px"><strong style="color:var(--ink)">In the EU (Google Cloud, Belgium).</strong> Your saved investigations and the database, the AI fact-checking (Google Gemini on Vertex AI), and the back-end service all run in the EU. The text or screenshot content you submit is processed in the EU and is <strong style="color:var(--ink)">never sent to the authentication service</strong>.</p><p style="margin:0 0 12px"><strong style="color:var(--ink)">In the United States (Google authentication service, under EU Standard Contractual Clauses).</strong> Only your <strong style="color:var(--ink)">account identity</strong> is handled here: your Google name, email address, profile photo, and sign-in timestamps. The content you submit is never sent to this service.</p><p style="margin:0">Analytics data, where you have consented, may also be processed by Google outside the EU. Transfers outside the EEA rely on the European Commission&rsquo;s <strong style="color:var(--ink)">Standard Contractual Clauses</strong> (SCCs). [Legal to confirm the specific mechanisms and any supplementary measures.]</p>' },
    { h: 'Retention and deletion', body: '<p style="margin:0 0 12px">Saved investigations are retained until you delete them, or for no longer than <strong style="color:var(--ink)">[RETENTION PERIOD]</strong> after your last activity, whichever is sooner. Text submitted for analysis is retained only as long as needed to produce and return an answer, plus <strong style="color:var(--ink)">[RETENTION PERIOD]</strong> thereafter for security and reliability. [Specific periods to be confirmed by legal.]</p><p style="margin:0">You can delete individual investigations or folders at any time in the app. To delete all data associated with your account, use the in-app deletion option or contact us.</p>' },
    { h: 'Your rights', body: '<p style="margin:0 0 12px">Under the GDPR you have the right to <strong style="color:var(--ink)">access</strong>, <strong style="color:var(--ink)">rectification</strong>, <strong style="color:var(--ink)">erasure</strong>, <strong style="color:var(--ink)">restriction</strong> of processing, <strong style="color:var(--ink)">objection</strong> to processing, and <strong style="color:var(--ink)">data portability</strong>. To exercise any of these, contact <strong style="color:var(--ink)">[CONTROLLER CONTACT]</strong>.</p><p style="margin:0">Because access requires Google sign-in, we can identify your data through your account, which makes these requests straightforward to honour. To exercise any right, contact us using the details above.</p>' },
    { h: 'Right to lodge a complaint', body: '<p style="margin:0">If you believe your data has been handled unlawfully, you have the right to lodge a complaint with your local <strong style="color:var(--ink)">supervisory authority (Data Protection Authority)</strong> in the EU/EEA country where you live or work.</p>' },
    { h: "Children's use", body: '<p style="margin:0">Newsqora is not directed to children. It is intended for users who meet the minimum age required in their country to consent to data processing. We do not knowingly collect data from children below that age; if you believe this has occurred, contact us and we will delete it.</p>' },
    { h: 'Changes and effective date', body: '<p style="margin:0">We may update this policy as the service evolves or as legal review concludes. Material changes will be posted here with a revised effective date. <strong style="color:var(--ink)">Effective date: [EFFECTIVE DATE] (draft).</strong></p>' },
    { h: 'Contact', body: '<p style="margin:0">Data-protection requests: <strong style="color:var(--ink)">[CONTROLLER CONTACT]</strong>. General enquiries: <a href="mailto:newsqora@gmail.com" style="color:var(--accent)">newsqora@gmail.com</a>.</p>' }
  ];

  var TERMS = [
    { h: '1 · Acceptance of these terms', body: '<p style="margin:0">By accessing or using Newsqora you agree to these Terms of Service. If you do not agree, do not use the service. These terms form an agreement between you and the operator of Newsqora.</p>' },
    { h: '2 · What Newsqora provides', body: '<p style="margin:0">Newsqora is a research instrument that verifies claims, links, and screenshots against real sources and returns a graded, cited assessment. It provides <strong style="color:var(--ink)">information only</strong>. It is not a newsfeed, not a chatbot companion, and it does not make decisions for you.</p>' },
    { h: '3 · Not professional advice', body: '<p style="margin:0">Newsqora does not provide medical, legal, financial, or other professional advice, and its output must not be relied upon as such. For decisions in those areas, consult a qualified professional. You are responsible for how you act on the information provided.</p>' },
    { h: '4 · Acceptable use', body: '<p style="margin:0 0 12px">You agree to use Newsqora lawfully and for genuine verification. You agree not to:</p><ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:7px"><li>use the service for any illegal activity, or to facilitate one;</li><li>seek or generate dark-web, harmful, exploitative, or otherwise dangerous content;</li><li>attempt to harass, defame, or endanger any person using the service;</li><li>interfere with, overload, or attempt to reverse-engineer the service or its security.</li></ul>' },
    { h: '5 · Accounts and sign-in', body: '<p style="margin:0">During the beta, using Newsqora <strong style="color:var(--ink)">requires signing in with Google</strong>; there is no guest mode. You are responsible for activity under your account and for keeping your sign-in secure. You are responsible for your compliance with these terms, and we may restrict or block access that violates them or threatens the security of the service.</p>' },
    { h: '6 · Sources and accuracy', body: '<p style="margin:0">Newsqora reports what verifiable sources say and grades its confidence accordingly; it does not claim certainty and will state when sources are insufficient. Source material is owned by its respective publishers, and links are provided for reference only. We do not endorse the content of third-party sources.</p>' },
    { h: '7 · No warranty', body: '<p style="margin:0">The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including accuracy, fitness for a particular purpose, or uninterrupted availability, to the fullest extent permitted by law.</p>' },
    { h: '8 · Limitation of liability', body: '<p style="margin:0">To the fullest extent permitted by law, the operator of Newsqora is not liable for any indirect, incidental, or consequential damages arising from your use of, or reliance on, the service or its output.</p>' },
    { h: '9 · Changes and contact', body: '<p style="margin:0">We may update these terms as the service evolves; material changes will be posted here with an updated date. Questions about these terms: <a href="mailto:newsqora@gmail.com" style="color:var(--accent)">newsqora@gmail.com</a>.</p>' }
  ];

  // ---- State -------------------------------------------------------------
  var app = document.getElementById('app');
  var state = { route: 'home', theme: 'light', active: 'top' };

  function routeFromPath() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (p === '/privacy') return 'privacy';
    if (p === '/terms') return 'terms';
    return 'home';
  }

  // ---- Templates ---------------------------------------------------------
  function header() {
    var links = NAV.map(function (d) {
      var isActive = state.route === 'home' && state.active === d.id;
      var color = isActive ? 'var(--ink)' : 'var(--ink-soft)';
      var scale = isActive ? 1 : 0;
      return '<a href="' + d.href + '" data-nav="' + d.id + '" aria-current="' + (isActive ? 'true' : 'false') + '" style="position:relative; font-size:14px; font-weight:600; color:' + color + '; text-decoration:none; padding:8px 12px; border-radius:8px; transition:color .2s ease;">' +
        d.label +
        '<span style="position:absolute; left:12px; right:12px; bottom:3px; height:2px; border-radius:2px; background:var(--ink); transform:scaleX(' + scale + '); transform-origin:left; transition:transform .25s ease;"></span>' +
        '</a>';
    }).join('');

    return '' +
    '<div style="background:var(--accent); color:#fff; font-size:13px; font-weight:600; letter-spacing:.01em; text-align:center; padding:9px 16px;">' +
      '<span style="opacity:.9;">Newsqora is in private beta.</span>' +
      '<a href="' + BETA_HREF + '" style="color:#fff; text-decoration:underline; text-underline-offset:2px; margin-left:6px;">Request access</a>' +
    '</div>' +
    '<header style="position:sticky; top:0; z-index:40; backdrop-filter:blur(18px) saturate(160%); -webkit-backdrop-filter:blur(18px) saturate(160%); background:color-mix(in srgb, var(--paper) 82%, transparent); border-bottom:1px solid var(--hairline);">' +
      '<div style="max-width:1140px; margin:0 auto; padding:14px clamp(20px,5vw,40px); display:flex; align-items:center; justify-content:space-between; gap:24px;">' +
        '<a href="/" data-link="home" style="display:flex; align-items:center; gap:11px; text-decoration:none; flex-shrink:0;">' +
          '<img src="newsqora-mark.svg" alt="Newsqora" width="34" height="21" style="display:block; width:34px; height:auto;">' +
          '<span style="font-family:\'Newsreader\',Georgia,serif; font-weight:500; font-size:23px; letter-spacing:-.01em; color:var(--accent);">Newsqora</span>' +
        '</a>' +
        '<nav style="display:flex; align-items:center; gap:4px; flex-wrap:wrap; justify-content:flex-end;">' +
          links +
          '<button data-action="theme" aria-label="Toggle colour theme" style="width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid var(--hairline-strong); border-radius:10px; color:var(--ink); margin-left:6px; cursor:pointer;">' +
            '<span style="font-size:15px;">' + (state.theme === 'dark' ? '☀' : '☾') + '</span>' +
          '</button>' +
          '<a href="' + BETA_HREF + '" style="font-size:14px; font-weight:600; color:#fff; background:var(--accent); text-decoration:none; padding:10px 16px; border-radius:11px; margin-left:6px; white-space:nowrap;">Request beta</a>' +
        '</nav>' +
      '</div>' +
    '</header>';
  }

  function landing() {
    var promises = PROMISES.map(function (pr) {
      return '<span style="display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--ink-soft); background:var(--card); border:1px solid var(--hairline); padding:8px 14px; border-radius:999px;"><span style="width:7px; height:7px; border-radius:50%; background:var(--accent);"></span>' + pr + '</span>';
    }).join('');

    var sources = DEMO_SOURCES.map(function (s) {
      return '<div style="display:flex; align-items:center; gap:14px; padding:13px 15px; background:var(--paper);">' +
        '<span style="width:8px; height:8px; border-radius:50%; flex-shrink:0; background:' + s.dot + ';"></span>' +
        '<div style="flex:1; min-width:0;">' +
          '<p style="margin:0; font-weight:600; font-size:14px; line-height:1.3;">' + s.title + '</p>' +
          '<p style="margin:2px 0 0; font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:var(--ink-mute);">' + s.meta + '</p>' +
        '</div>' +
        '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:var(--accent); white-space:nowrap;">View source →</span>' +
      '</div>';
    }).join('');

    var steps = STEPS.map(function (step) {
      return '<div style="display:flex; flex-direction:column; gap:14px;">' +
        '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:13px; color:var(--accent); border:1px solid var(--accent-soft); width:38px; height:38px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center;">' + step.n + '</span>' +
        '<h3 style="font-family:\'Newsreader\',Georgia,serif; font-weight:500; font-size:21px; line-height:1.25; letter-spacing:-.01em; margin:0;">' + step.title + '</h3>' +
        '<p style="font-size:15px; line-height:1.55; color:var(--ink-soft); margin:0;">' + step.body + '</p>' +
      '</div>';
    }).join('');

    var chips = CHIPS.map(function (chip) {
      return '<span style="display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600; letter-spacing:.01em; color:' + chip.fg + '; background:' + chip.bg + '; padding:8px 14px; border-radius:999px;"><span style="width:7px; height:7px; border-radius:50%; background:' + chip.fg + ';"></span>' + chip.label + '</span>';
    }).join('');

    var pillars = PILLARS.map(function (p) {
      return '<div style="background:var(--card); border:1px solid var(--hairline); border-radius:16px; padding:24px 22px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:11px;">' +
        '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--accent);">' + p.tag + '</span>' +
        '<h3 style="font-family:\'Newsreader\',Georgia,serif; font-weight:500; font-size:22px; line-height:1.2; letter-spacing:-.012em; margin:0;">' + p.title + '</h3>' +
        '<p style="font-size:14.5px; line-height:1.55; color:var(--ink-soft); margin:0;">' + p.body + '</p>' +
      '</div>';
    }).join('');

    return '<div>' +
    // Hero
    '<section id="top" style="max-width:1140px; margin:0 auto; padding:clamp(56px,9vw,108px) clamp(20px,5vw,40px) clamp(40px,6vw,64px);">' +
      '<div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:26px;">' +
        '<img src="newsqora-mark.svg" alt="" width="84" height="51" style="width:clamp(70px,12vw,96px); height:auto; filter:drop-shadow(0 12px 28px rgba(109,32,255,0.22));">' +
        '<div style="display:inline-flex; align-items:center; gap:8px; font-family:\'IBM Plex Mono\',monospace; font-size:11.5px; letter-spacing:.04em; text-transform:uppercase; color:var(--accent); background:var(--accent-bg); padding:6px 12px; border-radius:999px;">' +
          '<span class="nq-pulse-dot" style="width:6px; height:6px; border-radius:50%; background:var(--accent);"></span>Mobile fact-checking · Private beta' +
        '</div>' +
        '<h1 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(38px,6.4vw,72px); line-height:1.05; letter-spacing:-.022em; margin:0; max-width:16ch; text-wrap:balance;">Every question is welcome. Every answer is honest.</h1>' +
        '<p style="font-size:clamp(16px,2vw,20px); line-height:1.55; color:var(--ink-soft); max-width:60ch; margin:0; text-wrap:pretty;">Newsqora verifies claims, links, and screenshots against real sources, and returns a graded confidence, never a binary true or false, with every citation listed: who said it, when, and where.</p>' +
        '<div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:6px;">' +
          '<a href="' + BETA_HREF + '" style="font-size:16px; font-weight:600; color:#fff; background:var(--accent); text-decoration:none; padding:15px 24px; border-radius:13px; box-shadow:var(--shadow-md);">Request beta access</a>' +
          '<span style="font-size:16px; font-weight:600; color:var(--ink); background:var(--card); border:1px solid var(--hairline); padding:15px 24px; border-radius:13px; box-shadow:var(--shadow-sm); display:inline-flex; align-items:center; gap:9px;"><span style="width:7px; height:7px; border-radius:50%; background:var(--honey);"></span>Coming to Android</span>' +
        '</div>' +
        '<div style="display:flex; flex-wrap:wrap; gap:9px; justify-content:center; margin-top:8px;">' + promises + '</div>' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; color:var(--ink-mute); margin:6px 0 0;">A research instrument, not a newsfeed, not a chatbot.</p>' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11.5px; line-height:1.5; color:var(--ink-mute); margin:8px 0 0; max-width:64ch;">Your content and saved data are processed in the EU. Account identity may be processed outside the EU,&nbsp;<a href="/privacy" data-link="privacy" style="color:var(--accent); text-decoration:underline; text-underline-offset:2px;">see the Privacy Policy</a>.</p>' +
      '</div>' +

      // Verdict card
      '<div style="margin-top:clamp(44px,6vw,68px); max-width:760px; margin-left:auto; margin-right:auto; background:var(--card); border:1px solid var(--hairline); border-radius:20px; box-shadow:var(--shadow-lg); overflow:hidden;">' +
        '<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 20px; border-bottom:1px solid var(--hairline);">' +
          '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-mute);">Illustration · how a verdict reads</span>' +
          '<span style="display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:.02em; text-transform:uppercase; color:var(--c-caution); background:var(--c-caution-bg); padding:5px 10px; border-radius:999px;"><span style="width:6px; height:6px; border-radius:50%; background:var(--c-caution);"></span>Caution</span>' +
        '</div>' +
        '<div style="padding:22px 20px 24px;">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--ink-mute); margin:0 0 8px;">The claim</p>' +
          '<p style="font-family:\'Newsreader\',Georgia,serif; font-size:clamp(19px,2.6vw,24px); line-height:1.3; letter-spacing:-.01em; margin:0 0 22px;">&ldquo;A recent post claims a new policy takes effect nationwide next month.&rdquo;</p>' +
          '<div style="margin-bottom:22px;">' +
            '<div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px;">' +
              '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--ink-mute);">Confidence</span>' +
              '<span style="font-size:13px; font-weight:600; color:var(--ink-soft);">Partly supported · sources disagree on timing</span>' +
            '</div>' +
            '<div style="position:relative; height:12px; border-radius:999px; background:linear-gradient(90deg, var(--c-disputed) 0%, var(--c-caution) 38%, var(--c-trust) 100%); opacity:.92;">' +
              '<div style="position:absolute; top:50%; left:42%; transform:translate(-50%,-50%); width:20px; height:20px; border-radius:50%; background:var(--card); border:3px solid var(--ink); box-shadow:var(--shadow-sm);"></div>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; margin-top:7px; font-family:\'IBM Plex Mono\',monospace; font-size:10px; letter-spacing:.03em; text-transform:uppercase; color:var(--ink-mute);"><span>Disputed</span><span>Caution</span><span>Well supported</span></div>' +
          '</div>' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--ink-mute); margin:0 0 10px;">Sources consulted</p>' +
          '<div style="display:flex; flex-direction:column; gap:1px; border-radius:12px; overflow:hidden; border:1px solid var(--hairline);">' + sources + '</div>' +
          '<p style="font-size:13px; line-height:1.5; color:var(--ink-soft); margin:16px 0 0;">Where verified sources are insufficient, Newsqora says so plainly rather than guessing.</p>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // How it works
    '<section id="how" style="background:var(--card); border-top:1px solid var(--hairline); border-bottom:1px solid var(--hairline);">' +
      '<div style="max-width:1140px; margin:0 auto; padding:clamp(56px,8vw,92px) clamp(20px,5vw,40px);">' +
        '<div style="max-width:62ch; margin-bottom:clamp(36px,5vw,52px);">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin:0 0 14px;">How it works</p>' +
          '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(28px,4.4vw,46px); line-height:1.12; letter-spacing:-.02em; margin:0;">You bring what you saw. She reads the sources.</h2>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(248px,1fr)); gap:clamp(20px,3vw,32px);">' + steps + '</div>' +
        '<div style="margin-top:clamp(36px,5vw,52px); display:flex; flex-direction:column; gap:14px;">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute); margin:0;">The grade is never binary</p>' +
          '<div style="display:flex; flex-wrap:wrap; gap:10px;">' + chips + '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // Why trust it
    '<section id="trust" style="max-width:1140px; margin:0 auto; padding:clamp(56px,8vw,92px) clamp(20px,5vw,40px);">' +
      '<div style="max-width:62ch; margin-bottom:clamp(36px,5vw,52px);">' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin:0 0 14px;">Why trust it</p>' +
        '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(28px,4.4vw,46px); line-height:1.12; letter-spacing:-.02em; margin:0;">Built to be checked, not believed.</h2>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(258px,1fr)); gap:clamp(16px,2.4vw,24px);">' + pillars + '</div>' +
    '</section>' +

    // Perspectives
    '<section id="perspectives" style="background:var(--card); border-top:1px solid var(--hairline); border-bottom:1px solid var(--hairline);">' +
      '<div style="max-width:1140px; margin:0 auto; padding:clamp(56px,8vw,92px) clamp(20px,5vw,40px);">' +
        '<div style="max-width:62ch; margin-bottom:clamp(32px,4vw,44px);">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin:0 0 14px;">Perspectives</p>' +
          '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(28px,4.4vw,46px); line-height:1.12; letter-spacing:-.02em; margin:0 0 16px;">Contested topics, shown with equal weight.</h2>' +
          '<p style="font-size:16px; line-height:1.55; color:var(--ink-soft); margin:0;">On questions where reasonable sources disagree, Newsqora sets the perspectives side by side, each with its own citations, neither favoured, and takes no position of her own.</p>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; align-items:stretch;">' +
          '<div style="background:var(--paper); border:1px solid var(--hairline); border-radius:16px; padding:24px 22px; display:flex; flex-direction:column; gap:12px;">' +
            '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute);">Perspective A</span>' +
            '<p style="font-family:\'Newsreader\',Georgia,serif; font-size:19px; line-height:1.35; margin:0;">The case as one body of sources presents it, in its own terms.</p>' +
            '<div style="margin-top:auto; padding-top:8px; display:flex; flex-direction:column; gap:6px;"><span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:var(--ink-mute);">4 sources cited</span></div>' +
          '</div>' +
          '<div style="display:flex; align-items:center; justify-content:center;"><span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute); border:1px solid var(--hairline); padding:7px 12px; border-radius:999px; background:var(--card);">Equal weight</span></div>' +
          '<div style="background:var(--paper); border:1px solid var(--hairline); border-radius:16px; padding:24px 22px; display:flex; flex-direction:column; gap:12px;">' +
            '<span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute);">Perspective B</span>' +
            '<p style="font-family:\'Newsreader\',Georgia,serif; font-size:19px; line-height:1.35; margin:0;">The contrasting account, given the same space and the same scrutiny.</p>' +
            '<div style="margin-top:auto; padding-top:8px; display:flex; flex-direction:column; gap:6px;"><span style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; color:var(--ink-mute);">4 sources cited</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    // Closing CTA
    '<section id="contact" style="max-width:1140px; margin:0 auto; padding:clamp(64px,9vw,108px) clamp(20px,5vw,40px); text-align:center;">' +
      '<div style="display:flex; flex-direction:column; align-items:center; gap:22px;">' +
        '<img src="newsqora-mark.svg" alt="" width="60" height="37" style="width:60px; height:auto; opacity:.9;">' +
        '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(30px,5vw,52px); line-height:1.1; letter-spacing:-.02em; margin:0; max-width:18ch; text-wrap:balance;">Newsqora is where facts live, safely.</h2>' +
        '<p style="font-size:17px; line-height:1.55; color:var(--ink-soft); max-width:52ch; margin:0;">Private beta is opening gradually. To request access or ask a question, write to the address below.</p>' +
        '<a href="' + MAIL_HREF + '" style="font-family:\'IBM Plex Mono\',monospace; font-size:15px; font-weight:500; color:#fff; background:var(--accent); text-decoration:none; padding:15px 26px; border-radius:13px; box-shadow:var(--shadow-md);">' + EMAIL + '</a>' +
      '</div>' +
    '</section>' +
    '</div>';
  }

  function legal(title, draftBadge, sections) {
    var body = sections.map(function (s) {
      return '<section>' +
        '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:500; font-size:clamp(20px,3vw,26px); line-height:1.2; letter-spacing:-.012em; margin:0 0 12px;">' + s.h + '</h2>' +
        '<div style="font-size:16px; line-height:1.62; color:var(--ink-soft);">' + s.body + '</div>' +
      '</section>';
    }).join('');

    var badge = draftBadge
      ? '<div style="display:inline-flex; align-items:center; gap:8px; margin:22px 0 16px; font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.04em; text-transform:uppercase; color:var(--honey); background:var(--c-caution-bg); padding:6px 12px; border-radius:999px;"><span style="width:6px; height:6px; border-radius:50%; background:var(--honey);"></span>Draft: pending legal review</div>'
      : '';

    return '<div style="max-width:740px; margin:0 auto; padding:clamp(44px,7vw,80px) clamp(20px,5vw,40px) clamp(64px,9vw,100px);">' +
      '<a href="/" data-link="home" style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; color:var(--accent); text-decoration:none;">← Back to home</a>' +
      badge +
      '<h1 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(32px,5.4vw,52px); line-height:1.08; letter-spacing:-.02em; margin:' + (draftBadge ? '0 0 12px' : '26px 0 12px') + ';">' + title + '</h1>' +
      '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; color:var(--ink-mute); margin:0 0 40px;">Last updated: June 2026 · newsqora.com</p>' +
      '<div style="display:flex; flex-direction:column; gap:34px;">' + body + '</div>' +
    '</div>';
  }

  function follow() {
    var btns = SOCIALS.map(function (s) {
      return '<a class="nq-social" href="' + s.href + '" target="_blank" rel="noopener noreferrer" aria-label="' + s.name + '" title="' + s.name + '" style="display:inline-flex; align-items:center; justify-content:center; width:46px; height:46px; border-radius:14px; color:#fff; background:var(--accent); box-shadow:0 2px 10px color-mix(in srgb, var(--accent) 28%, transparent); transition:transform .2s ease, box-shadow .2s ease, background .2s ease;">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="display:block;" aria-hidden="true"><path d="' + s.path + '"></path></svg>' +
      '</a>';
    }).join('');

    return '<section id="follow" style="border-top:1px solid var(--hairline);">' +
      '<div style="max-width:1140px; margin:0 auto; padding:clamp(48px,7vw,76px) clamp(20px,5vw,40px); display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px;">' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent); margin:0;">Follow Newsqora</p>' +
        '<h2 style="font-family:\'Newsreader\',Georgia,serif; font-weight:400; font-size:clamp(30px,5vw,52px); line-height:1.1; letter-spacing:-.02em; margin:0 0 6px; max-width:20ch; text-wrap:balance;">Stay connected wherever you are.</h2>' +
        '<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:22px; max-width:530px;">' + btns + '</div>' +
      '</div>' +
    '</section>';
  }

  function footer() {
    return '<footer style="background:var(--card); border-top:1px solid var(--hairline);">' +
      '<div style="max-width:1140px; margin:0 auto; padding:clamp(44px,6vw,64px) clamp(20px,5vw,40px) 36px; display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:clamp(28px,4vw,48px);">' +
        '<div style="display:flex; flex-direction:column; gap:14px; max-width:30ch;">' +
          '<a href="/" data-link="home" style="display:flex; align-items:center; gap:10px; text-decoration:none;"><img src="newsqora-mark.svg" alt="Newsqora" width="30" height="18" style="width:30px; height:auto;"><span style="font-family:\'Newsreader\',Georgia,serif; font-weight:500; font-size:20px; color:var(--accent);">Newsqora</span></a>' +
          '<p style="font-size:14px; line-height:1.55; color:var(--ink-soft); margin:0;">A mobile research instrument for verifying claims, links, and screenshots against real sources.</p>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:11px;">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute); margin:0 0 3px;">Product</p>' +
          '<a href="/#how" data-nav="how" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">How it works</a>' +
          '<a href="/#trust" data-nav="trust" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">Why trust it</a>' +
          '<a href="/#perspectives" data-nav="perspectives" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">Perspectives</a>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:11px;">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute); margin:0 0 3px;">Legal</p>' +
          '<a href="/privacy" data-link="privacy" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">Privacy Policy</a>' +
          '<a href="/terms" data-link="terms" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">Terms of Service</a>' +
        '</div>' +
        '<div style="display:flex; flex-direction:column; gap:11px;">' +
          '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--ink-mute); margin:0 0 3px;">Contact</p>' +
          '<a href="' + MAIL_HREF + '" style="font-size:14px; color:var(--ink-soft); text-decoration:none;">' + EMAIL + '</a>' +
        '</div>' +
      '</div>' +
      '<div style="max-width:1140px; margin:0 auto; padding:18px clamp(20px,5vw,40px) 40px; border-top:1px solid var(--hairline); display:flex; flex-wrap:wrap; gap:10px 20px; justify-content:space-between; align-items:center;">' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11.5px; color:var(--ink-mute); margin:0;">© 2026 [CONTROLLER NAME]. All rights reserved.</p>' +
        '<p style="font-family:\'IBM Plex Mono\',monospace; font-size:11.5px; color:var(--ink-mute); margin:0;">newsqora.com</p>' +
      '</div>' +
    '</footer>';
  }

  // ---- Render & wire -----------------------------------------------------
  function render() {
    var main;
    if (state.route === 'privacy') main = legal('Privacy Policy', true, PRIVACY);
    else if (state.route === 'terms') main = legal('Terms of Service', false, TERMS);
    else main = landing();

    app.setAttribute('data-theme', state.theme);
    app.innerHTML = header() + '<main>' + main + '</main>' + follow() + footer();
    computeActive();
  }

  function navigate(route, opts) {
    opts = opts || {};
    var path = route === 'privacy' ? '/privacy' : route === 'terms' ? '/terms' : '/';
    if (!opts.replace) history.pushState({ route: route }, '', path + (opts.hash || ''));
    state.route = route;
    state.active = 'top';
    render();
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function scrollToSection(id) {
    var run = function () {
      if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    };
    if (state.route !== 'home') { navigate('home', { keepScroll: true }); setTimeout(run, 60); }
    else run();
  }

  function computeActive() {
    if (state.route !== 'home') return;
    var line = 90, current = 'top';
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = document.getElementById(SECTIONS[i]);
      if (el && el.getBoundingClientRect().top <= line) current = SECTIONS[i];
    }
    if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 4)) {
      current = SECTIONS[SECTIONS.length - 1];
    }
    if (current !== state.active) { state.active = current; updateNavHighlight(); }
  }

  function updateNavHighlight() {
    var links = app.querySelectorAll('header a[data-nav]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var isActive = state.route === 'home' && a.getAttribute('data-nav') === state.active;
      a.style.color = isActive ? 'var(--ink)' : 'var(--ink-soft)';
      a.setAttribute('aria-current', isActive ? 'true' : 'false');
      var underline = a.querySelector('span');
      if (underline) underline.style.transform = 'scaleX(' + (isActive ? 1 : 0) + ')';
    }
  }

  // ---- Events ------------------------------------------------------------
  app.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action], [data-nav], [data-link]');
    if (!t) return;

    if (t.getAttribute('data-action') === 'theme') {
      e.preventDefault();
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      render();
      return;
    }
    var navId = t.getAttribute('data-nav');
    if (navId) { e.preventDefault(); scrollToSection(navId); return; }
    var link = t.getAttribute('data-link');
    if (link) { e.preventDefault(); navigate(link); }
  });

  window.addEventListener('popstate', function () {
    state.route = routeFromPath();
    state.active = 'top';
    render();
  });

  var onScroll = function () { computeActive(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // ---- Init --------------------------------------------------------------
  state.route = routeFromPath();
  render();
})();
