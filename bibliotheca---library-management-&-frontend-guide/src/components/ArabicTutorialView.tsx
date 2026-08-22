import React, { useState } from 'react';
import { ARABIC_TUTORIAL_SECTIONS, TutorialSection } from '../data/arabicTutorialContent';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles, 
  Globe, 
  Terminal, 
  ExternalLink,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const ArabicTutorialView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(ARABIC_TUTORIAL_SECTIONS[0].id);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Interactive API playground for beginners
  const [apiTestQuery, setApiTestQuery] = useState('javascript');
  const [apiTestResult, setApiTestResult] = useState<string>('');
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const activeSection = ARABIC_TUTORIAL_SECTIONS.find(s => s.id === activeSectionId) || ARABIC_TUTORIAL_SECTIONS[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleRunAPITest = async () => {
    setIsTestingAPI(true);
    setApiTestResult('جاري استدعاء Open Library API...');
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(apiTestQuery)}&limit=3`;
      const res = await fetch(url);
      const data = await res.json();
      const summary = data.docs.map((doc: any, i: number) => ({
        index: i + 1,
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(', ') : 'غير معروف',
        year: doc.first_publish_year || 'غير محدد',
        isbn: doc.isbn ? doc.isbn[0] : 'لا يوجد',
        coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'لا يوجد غلاف'
      }));
      setApiTestResult(JSON.stringify(summary, null, 2));
    } catch (err: any) {
      setApiTestResult(`خطأ أثناء الاستدعاء: ${err.message}`);
    } finally {
      setIsTestingAPI(false);
    }
  };

  return (
    <div id="arabic-tutorial-container" className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-arabic" dir="rtl">
      {/* 1. Header & Instructor Introduction */}
      <section className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-10 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>الدليل الشامل للفرونت إند من الصفر للمبتدئين</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            دليل بناء تطبيق إدارة المكتبة خطوة بخطوة باللغة العربية
          </h1>
          <p className="text-purple-200 text-sm md:text-base max-w-3xl leading-relaxed">
            مرحباً بك في الأكاديمية البرمجية! هنا ستتعلم كيف تبني تطبيق صفحة واحدة (SPA) متكامل مستوحى من 
            تصميم وهيكلة <strong>NutriPlan</strong>، مع تقسيم الشيفرة إلى 3 ملفات جافاسكريبت + <code>main.js</code> واستدعاء 
            <strong> Open Library API</strong> الحقيقي والتخزين في <code>localStorage</code>.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-white/10 rounded-lg text-purple-200">
              ⚡ جافاسكريبت حديثة ES6 Modules
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-purple-200">
              🎨 بوتستراب Bootstrap 5 + CSS مخصص
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-purple-200">
              🌐 واجهة Open Library API المباشرة
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-purple-200">
              💾 التخزين المحلي LocalStorage و CRUD كامل
            </span>
          </div>
        </div>
      </section>

      {/* 2. File Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {ARABIC_TUTORIAL_SECTIONS.map((sec) => {
          const isActive = sec.id === activeSectionId;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{sec.filename || sec.title.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active Section Detail View */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 mb-2">
            {activeSection.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            {activeSection.title}
          </h2>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            {activeSection.subtitle}
          </p>
        </div>

        {/* Section Explanation */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
          {activeSection.explanation}
        </div>

        {/* Code Snippet Box with Copy Button */}
        {activeSection.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Code className="w-4 h-4 text-purple-600" />
                <span>الكود البرمجي للملف ({activeSection.filename})</span>
              </div>
              <button
                onClick={() => handleCopyCode(activeSection.codeSnippet!, activeSection.id)}
                className="btn btn-outline-secondary btn-sm text-xs rounded-xl px-3 py-1 flex items-center gap-1.5"
              >
                {copiedSection === activeSection.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ الكود</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-slate-200 text-xs font-mono p-4 border border-slate-800" dir="ltr">
              <pre className="overflow-x-auto">
                <code>{activeSection.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Key Concepts Grid */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>المفاهيم البرمجية الأساسية في هذا الجزء:</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeSection.keyConcepts.map((item, idx) => (
              <div key={idx} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-1">
                <h4 className="font-bold text-xs text-purple-950">{item.term}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step Implementation Checklist */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>خطوات التنفيذ المنهجية للمبتدئ:</span>
          </h3>
          <div className="space-y-2">
            {activeSection.stepByStepGuide.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Open Library API Testing Sandbox */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Terminal className="w-5 h-5" />
          <h3 className="text-lg font-bold">مختبر تجربة Open Library API المباشر للمبتدئين</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          جرب استدعاء الـ API الآن لترى كيف تصل البيانات الحقيقية من الخادم بصيغة JSON قبل معالجتها ورسمها على الشاشة!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={apiTestQuery}
            onChange={(e) => setApiTestQuery(e.target.value)}
            placeholder="اكتب كلمة بحث مثل: clean code أو flutter أو history..."
            className="flex-grow bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleRunAPITest}
            disabled={isTestingAPI}
            className="btn btn-warning text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTestingAPI ? 'جاري الاستدعاء...' : 'تجربة استدعاء الـ API'}</span>
          </button>
        </div>

        {apiTestResult && (
          <div className="mt-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs font-mono overflow-x-auto text-emerald-400" dir="ltr">
            <pre>{apiTestResult}</pre>
          </div>
        )}
      </section>
    </div>
  );
};
