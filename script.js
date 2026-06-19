// Header shadow on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  '.section-head, .product-card, .detail-text, .detail-visual, .compare-col, .compare-vs, .flow-steps li, .contact-text, .contact-form'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => io.observe(el));

// Contact form (demo handling — no backend)
// ============================================================
// お問い合わせフォーム（Googleフォーム連携）
// 通知先メール: miraishain.llc@gmail.com
//   ※このGmailアカウントでGoogleフォームを作成し、
//     「回答」タブ→⋮→メール通知ON にすると上記宛に届きます。
// ------------------------------------------------------------
// ↓ ここにご自身のGoogleフォームの情報を入れてください。
//   formId : フォームの「回答用URL」の /d/e/●●●/viewform の ●●● 部分
//   fields : 各項目に対応する entry.数字 のID（取得方法はREADME参照）
//   未設定（PASTE_…のまま）の場合は、送信せずお礼表示だけのデモ動作になります。
// ============================================================
const GOOGLE_FORM = {
  formId: '1FAIpQLSeYHjxLLCgif5CIQFuR3zR0xG9CysLTLD0NmcAvt-qRQS9Yzg',
  fields: {
    name: 'entry.1580231162',
    company: 'entry.1153433503',
    email: 'entry.1795697950',
    message: 'entry.1052167202'
  }
};

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = form.querySelector('button[type="submit"]');

const isConfigured = () =>
  !GOOGLE_FORM.formId.startsWith('PASTE_') &&
  !Object.values(GOOGLE_FORM.fields).some((id) => id.includes('PASTE_'));

const showThanks = () => {
  note.textContent = '送信ありがとうございます。担当より折り返しご連絡します。';
  note.hidden = false;
  submitBtn.disabled = true;
  submitBtn.textContent = '送信しました';
  form.reset();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Googleフォーム未設定ならデモ動作（お礼表示のみ）
  if (!isConfigured()) {
    showThanks();
    return;
  }

  const data = new FormData();
  data.append(GOOGLE_FORM.fields.name, form.name.value);
  data.append(GOOGLE_FORM.fields.company, form.company.value);
  data.append(GOOGLE_FORM.fields.email, form.email.value);
  data.append(GOOGLE_FORM.fields.message, form.message.value);

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中…';

  try {
    // GoogleフォームはCORSを返さないため no-cors で送信（応答は読めないが登録は成功する）
    await fetch(
      `https://docs.google.com/forms/d/e/${GOOGLE_FORM.formId}/formResponse`,
      { method: 'POST', mode: 'no-cors', body: data }
    );
    showThanks();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送信する';
    note.textContent = '送信に失敗しました。お手数ですが時間をおいて再度お試しください。';
    note.hidden = false;
  }
});

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
