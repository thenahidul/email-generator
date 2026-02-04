
import React, { useState, useEffect } from 'react';
import { getEduTips } from '../services/geminiService';

interface Tip {
  title: string;
  description: string;
}

const BenefitsSection: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      const data = await getEduTips('student software discounts');
      setTips(data);
      setLoading(false);
    };
    fetchTips();
  }, []);

  return (
    <div className="py-12 bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Maximize Your Academic Impact</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          AI-curated tips on how to leverage educational email addresses for your professional growth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-2xl"></div>
             ))
          ) : (
            tips.map((tip, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <i className={`fas ${idx === 0 ? 'fa-code' : idx === 1 ? 'fa-tags' : 'fa-graduation-cap'} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
