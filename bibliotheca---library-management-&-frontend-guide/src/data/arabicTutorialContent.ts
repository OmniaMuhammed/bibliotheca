export interface TutorialSection {
  id: string;
  title: string;
  subtitle: string;
  filename?: string;
  badge: string;
  explanation: string;
  codeSnippet?: string;
  keyConcepts: { term: string; explanation: string }[];
  stepByStepGuide: string[];
}

export const ARABIC_TUTORIAL_SECTIONS: TutorialSection[] = [
  {
    id: 'architecture',
    title: '١. البنية المعمارية لتطبيق إدارة المكتبة (SPA Architecture)',
    subtitle: 'كيف يعمل تطبيق الصفحة الواحدة وكيف يتم تقسيم الكود بطريقة احترافية مثل NutriPlan',
    badge: 'المعمارية والمفاهيم',
    explanation: `مرحباً بك يا بطل البرمجة! في عالم تطوير الويب الحديث (Front-End Development)، التطبيقات الاحترافية لا تعتمد على حشو كل الأكواد في ملف واحد، بل تُبنى بنمط "فصل الاهتمامات" (Separation of Concerns).

قمنا بتقسيم هذا المشروع إلى 4 ملفات JavaScript رئيسية وفقاً للمواصفات:
1. data.js: مسؤول فقط عن البيانات (Data Layer & API)
2. ui.js: مسؤول فقط عن العرض وتحديث الشاشة (Presentation & DOM Manipulation)
3. app.js: حلقة الوصل ومنظم حركة التطبيق (Controller & Business Logic)
4. main.js: نقطة البداية وتشغيل التطبيق (Application Bootstrap)`,
    keyConcepts: [
      { term: 'SPA (Single Page Application)', explanation: 'تطبيق صفحة واحدة يتم فيه التنقل بين الأقسام بسرعة خاطفة بدون إعادة تحميل الصفحة بالكامل من الخادم.' },
      { term: 'Separation of Concerns (SoC)', explanation: 'مبدأ هندسي يعزل منطق البيانات عن التصميم وعن إدارة الأحداث لسهولة الصيانة والتطوير.' },
      { term: 'Local Storage', explanation: 'مساحة تخزين محلية داخل متصفح المستخدم تسمح بحفظ الكتب وسجلات النشاط حتى بعد إغلاق المتصفح.' }
    ],
    stepByStepGuide: [
      'الخطوة 1: تخطيط هيكل المجلدات والملفات (HTML + CSS + data.js + ui.js + app.js + main.js).',
      'الخطوة 2: إنشاء قاعدة البيانات التجريبية وهيكل كائنات الكتب (Book Object) وسجل النشاط (Log Object).',
      'الخطوة 3: بناء القائمة الجانبية (Sidebar) والأقسام الرئيسية الثلاثة (الرئيسية، البحث والعمليات، وسجل النشاط).',
      'الخطوة 4: ربط واجهة Open Library API لجلب الكتب الحقيقية وأغلفتها.',
      'الخطوة 5: تفعيل عمليات CRUD الأربعة (إضافة، قراءة، تعديل، حذف) مع حفظ فوري في LocalStorage.'
    ]
  },
  {
    id: 'data-js',
    title: '٢. شرح ملف data.js (طبقة البيانات والـ API)',
    subtitle: 'إدارة الكتب، استدعاء Open Library API، والتخزين المحلي LocalStorage',
    filename: 'data.js',
    badge: 'طبقة البيانات',
    explanation: `ملف data.js هو "عقل البيانات" في التطبيق. وظيفته أن يوفر دوال تتعامل مع:
- جلب الكتب المخزنة وحفظها عبر localStorage
- استدعاء Open Library API لجلب معلومات وأغلفة الكتب بالبحث الحي
- تسجيل كل حركة يقوم بها المستخدم في سجل الـ Logs
- تصدير واستيراد البيانات بصيغة CSV و JSON`,
    codeSnippet: `// data.js - طبقة البيانات والـ API
const STORAGE_KEY = 'library_books';
const LOGS_KEY = 'library_logs';

// 1. جلب الكتب من الذاكرة المحلية
export function getStoredBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 2. حفظ الكتب
export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// 3. استدعاء Open Library API
export async function fetchBooksFromAPI(query) {
  try {
    const url = \`https://openlibrary.org/search.json?q=\${encodeURIComponent(query)}&limit=10\`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('فشل جلب البيانات من الخادم');
    const result = await response.json();
    return result.docs; // قائمة الكتب الواردة من الـ API
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    return [];
  }
}

// 4. دالة تسجيل الأحداث في الـ Log
export function addLogEntry(action, details, bookTitle = '') {
  const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  const entry = {
    id: 'log-' + Date.now(),
    action, // 'add' | 'update' | 'delete' | 'search' | 'view'
    bookTitle,
    timestamp: new Date().toISOString(),
    details
  };
  logs.unshift(entry);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return entry;
}`,
    keyConcepts: [
      { term: 'async / await', explanation: 'طريقة حديثة في جافاسكريبت للتعامل مع العمليات غير المتزامنة مثل استدعاء الـ APIs بدون تجميد المتصفح.' },
      { term: 'JSON.stringify & JSON.parse', explanation: 'التحويل بين كائنات جافاسكريبت والنصوص لحفظها داخل localStorage واستعادتها.' },
      { term: 'Fetch API', explanation: 'الواجهة القياسية في المتصفحات لإرسال طلبات HTTP إلى الخوادم الخارجية.' }
    ],
    stepByStepGuide: [
      '1. أنشئ ثوابت أسماء المفاتيح في LocalStorage.',
      '2. اكتب دالة getStoredBooks و saveBooks لتأمين حفظ واسترجاع الكتب.',
      '3. اكتب دالة fetchBooksFromAPI مستخدماً try/catch لمعالجة أي انقطاع بالإنترنت بأمان.',
      '4. أنشئ دالة addLogEntry لتوثيق كل حركة يقوم بها المستخدم مع التاريخ والوقت.'
    ]
  },
  {
    id: 'ui-js',
    title: '٣. شرح ملف ui.js (طبقة العرض والـ DOM)',
    subtitle: 'رسم البطاقات، الجداول، النوافذ المنبثقة Modals، والتنبيهات Toasts',
    filename: 'ui.js',
    badge: 'واجهة المستخدم',
    explanation: `ملف ui.js هو المسؤول الحصري عن شاشة المستخدم. يقوم بقراءة البيانات وتحويلها إلى عناصر HTML تفاعلية باستخدام Bootstrap 5 و CSS مخصص. لا يحتوي على منطق حفظ البيانات، بل يركز فقط على الرندر (Rendering).`,
    codeSnippet: `// ui.js - معالجة وتوليد عناصر الشاشة
export function renderBookCard(book) {
  return \`
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm border-0 book-card">
        <img src="\${book.coverImage}" class="card-img-top book-cover" alt="\${book.title}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-primary mb-2 align-self-start">\${book.genre}</span>
          <h5 class="card-title text-truncate fw-bold">\${book.title}</h5>
          <p class="card-text text-muted mb-3"><i class="bi bi-person me-1"></i>\${book.author}</p>
          <div class="mt-auto d-flex justify-content-between">
            <button class="btn btn-outline-primary btn-sm view-btn" data-id="\${book.id}">التفاصيل</button>
            <button class="btn btn-outline-danger btn-sm delete-btn" data-id="\${book.id}">حذف</button>
          </div>
        </div>
      </div>
    </div>
  \`;
}

// إظهار إشعار Toast لطيف للمستخدم
export function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toastId = 'toast-' + Date.now();
  const html = \`
    <div id="\${toastId}" class="toast align-items-center text-bg-\${type} border-0 show mb-2">
      <div class="d-flex">
        <div class="toast-body">
          <strong>\${title}:</strong> \${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  \`;
  container.insertAdjacentHTML('beforeend', html);
  setTimeout(() => document.getElementById(toastId)?.remove(), 4000);
}`,
    keyConcepts: [
      { term: 'Template Literals (`...`)', explanation: 'النصوص القالبية في ES6 التي تسمح بدمج المتغيرات \${var} وتوليد كود HTML متعدد الأسطر بنظافة وسهولة.' },
      { term: 'DOM Manipulation', explanation: 'تعديل شجرة الصفحة (إضافة عناصر، مسح عناصر، تغيير النصوص والكلاسات) برمجياً.' },
      { term: 'Bootstrap 5 Utility Classes', explanation: 'كلاسات مساعدة سريعة لتنسيق المسافات (mb-3, p-2)، الألوان (bg-primary)، والمرونة (d-flex).' }
    ],
    stepByStepGuide: [
      '1. صمم شكل بطاقة الكتاب (Card) مع غلاف وظل أنيق عند التمرير.',
      '2. صمم شكل الصف داخل جدول الكتب لعرضه في نمط الـ Table View.',
      '3. صمم دالة لعرض رسائل النجاح والخطأ (Toasts) التلقائية الاختفاء.',
      '4. أنشئ هياكل الانتظار (Skeleton Loaders) أثناء جلب الكتب من الإنترنت.'
    ]
  },
  {
    id: 'app-js',
    title: '٤. شرح ملف app.js (منطق العمليات والـ Routing)',
    subtitle: 'تنفيذ عمليات CRUD، تبديل الصفحات، والاستماع للأحداث Event Listeners',
    filename: 'app.js',
    badge: 'منطق العمليات والتوجيه',
    explanation: `ملف app.js هو المايسترو الذي يربط بين ui.js و data.js. عندما يضغط المستخدم على زر "إضافة كتاب" أو يبحث في الـ API، يقوم app.js بالتقاط الحدث، استدعاء دالة البيانات من data.js، ثم طلب التحديث من ui.js!`,
    codeSnippet: `// app.js - المايسترو والموجّه
import * as data from './data.js';
import * as ui from './ui.js';

export function setupEventListeners() {
  // 1. التنقل في القائمة الجانبية (Client-side Routing)
  document.querySelectorAll('.nav-link[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      switchPage(target);
    });
  });

  // 2. البحث الحي في الـ API مع تقنية Debounce
  const searchInput = document.getElementById('api-search-input');
  let debounceTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const query = e.target.value;
      if (query.length > 2) {
        ui.showLoadingSkeleton();
        const results = await data.fetchBooksFromAPI(query);
        ui.renderSearchResults(results);
        data.addLogEntry('search', \`بحث المستخدم عن: "\${query}"\`);
      }
    }, 400); // انتظار 400ms بعد توقف المستخدم عن الكتابة
  });
}

export function switchPage(pageId) {
  document.querySelectorAll('.app-section').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(pageId)?.classList.remove('d-none');
}`,
    keyConcepts: [
      { term: 'Event Delegation', explanation: 'وضع مستمع حدث واحد على الحاوية الأب للتعامل مع العناصر المنشأة ديناميكياً لتوفير موارد الذاكرة.' },
      { term: 'Debounce', explanation: 'تأخير تنفيذ دالة البحث حتى يتوقف المستخدم عن الكتابة لمنع إغراق الـ API بطلبات غير ضرورية.' },
      { term: 'CRUD Lifecycle', explanation: 'دورة العمليات الأساسية في أي نظام: Create (إنشاء), Read (قراءة), Update (تعديل), Delete (حذف).' }
    ],
    stepByStepGuide: [
      '1. اربط أزرار التنقل (Sidebar) لتغيير الصفحة النشطة بدون إعادة تحميل.',
      '2. نفّذ استماع حدث إرسال نموذج إضافة وتعديل الكتاب (Form Submit).',
      '3. أضف تأكيد الحذف (Delete Confirmation Dialog) لمنع حذف أي كتاب بالخطأ.',
      '4. فعّل التصفية والفلترة بحسب النوع والتصنيف والتقييم.'
    ]
  },
  {
    id: 'main-js',
    title: '٥. شرح ملف main.js ونقطة الانطلاق (Application Entry Point)',
    subtitle: 'تهيئة التطبيق، تحميل الكتب الافتراضية، وفحص حالة المتصفح',
    filename: 'main.js',
    badge: 'نقطة الانطلاق',
    explanation: `ملف main.js هو الملف الذي يتم استدعاؤه أولاً في صفحة HTML. يقوم بتهيئة الحالة، التأكد من جاهزية الـ DOM، وبدء استدعاء دوال التهيئة في app.js.`,
    codeSnippet: `// main.js - نقطة البداية
import { setupEventListeners, switchPage } from './app.js';
import { getStoredBooks, fetchFeaturedBooks } from './data.js';
import { renderDashboardStats, renderFeaturedBooks } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 تم تشغيل نظام إدارة المكتبة بنجاح!');
  
  // 1. تفعيل مستمعات الأحداث
  setupEventListeners();

  // 2. تحميل إحصائيات لوحة التحكم
  const localBooks = getStoredBooks();
  renderDashboardStats(localBooks);

  // 3. جلب الكتب المميزة عبر الـ API
  const featured = await fetchFeaturedBooks();
  renderFeaturedBooks(featured);

  // 4. فتح الصفحة الافتراضية (Home)
  switchPage('home-section');
});`,
    keyConcepts: [
      { term: 'DOMContentLoaded', explanation: 'حدث يُطلق عند اكتمال بناء شجرة عناصر الـ HTML قبل تحميل الصور والملفات الكبيرة للبدء فوراً.' },
      { term: 'ES6 Modules (import/export)', explanation: 'نظام المعاملات في جافاسكريبت الحديثة لتضمين الدوال والكائنات بين الملفات بدقة وبدون تلوث النطاق العام (Global Scope).' }
    ],
    stepByStepGuide: [
      '1. أنشئ مستمع الحدث DOMContentLoaded.',
      '2. استدعِ دوال التهيئة المصدّرة من app.js و ui.js.',
      '3. تأكد من تحميل الكتب المخزنة مسبقاً وتحديث أرقام الإحصائيات.',
      '4. ابدأ تحميل الكتب المميزة من Open Library في الخلفية.'
    ]
  }
];
