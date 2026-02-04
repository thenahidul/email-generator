
import React, { useState, useEffect } from 'react';
import { mailService } from '../services/mailService';
import { Domain, Account } from '../types';

interface GeneratorProps {
  onAccountCreated: (account: Account) => void;
  isLoading: boolean;
}

const Generator: React.FC<GeneratorProps> = ({ onAccountCreated, isLoading }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [password, setPassword] = useState<string>('pass' + Math.floor(Math.random() * 10000));
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await mailService.getDomains();
        setDomains(res);
        if (res.length > 0) {
          // Look for an academic sounding domain first
          const academic = res.find(d => d.domain.includes('.edu') || d.domain.includes('.ac'));
          setSelectedDomain(academic ? academic.domain : res[0].domain);
        }
      } catch (err) {
        setError('Failed to fetch mail domains.');
      }
    };
    fetchDomains();
  }, []);

  const handleGenerate = async () => {
    if (!prefix || !selectedDomain) {
      setError('Please provide a username and select a domain.');
      return;
    }
    setError('');
    const fullAddress = `${prefix.toLowerCase().replace(/\s+/g, '')}@${selectedDomain}`;
    try {
      await mailService.createAccount(fullAddress, password);
      const token = await mailService.getToken(fullAddress, password);
      onAccountCreated({ id: '', address: fullAddress, password, token });
    } catch (err: any) {
      setError('Address taken or service unavailable. Try a different username.');
    }
  };

  const randomizePrefix = () => {
    const names = ['student', 'learner', 'scholar', 'researcher', 'dev', 'academic'];
    const random = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 9999);
    setPrefix(random);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <i className="fas fa-magic text-blue-500"></i>
        Generate New Academic Address
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username / Prefix</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. john_doe"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={randomizePrefix}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fas fa-dice"></i>
              Random
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Domain</label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
          >
            {domains.map((d) => (
              <option key={d.id} value={d.domain}>
                @{d.domain} {d.domain.includes('.edu') ? '🎓' : ''}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              Generate Address
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        By generating, you get a temporary address valid as long as this session is active.
      </p>
    </div>
  );
};

export default Generator;
