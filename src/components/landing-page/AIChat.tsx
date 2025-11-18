'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface FormDataForAnalysis {
  name: string;
  service_type: string;
  project_description: string;
  features: string;
  budget: string;
}

interface ChatProps {
  formData: FormDataForAnalysis;
  onClose: () => void;
}

export default function Chat({ formData, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const analyzeProject = async () => {
      try {
        const response = await fetch('/api/ai-analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          const aiResponse = result.analysis;
          
          // Save AI analysis to lead data using the lead ID from form submission
          // In this case, we don't have a lead ID from the initial submission, 
          // so we'll skip saving to database for now since we don't track the lead ID
          
          setMessages([
            {
              id: '1',
              text: `Terima kasih telah mengirimkan formulir Anda, ${formData.name}. Saya telah menganalisis proyek Anda dan ini hasilnya:`,
              sender: 'ai',
              timestamp: new Date()
            },
            {
              id: '2',
              text: aiResponse,
              sender: 'ai',
              timestamp: new Date()
            }
          ]);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('AI Analysis API Error:', errorData);
          setMessages([
            {
              id: '1',
              text: `Terima kasih telah mengirimkan formulir Anda, ${formData.name}. Maaf, terjadi kesalahan saat menganalisis proyek Anda. Kami sedang memperbaiki sistem kami. Berikut adalah ringkasan proyek Anda:`,
              sender: 'ai',
              timestamp: new Date()
            },
            {
              id: '2',
              text: `Jenis Proyek: ${formData.service_type}\nDeskripsi: ${formData.project_description}\nFitur-fitur: ${formData.features}\nAnggaran: ${formData.budget}\n\nTim kami akan segera menghubungi Anda untuk membahas lebih lanjut.`,
              sender: 'ai',
              timestamp: new Date()
            }
          ]);
        }
      } catch (error) {
        console.error('Error analyzing project:', error);
        setMessages([
          {
            id: '1',
            text: `Terima kasih telah mengirimkan formulir Anda, ${formData.name}. Terjadi kesalahan teknis saat menganalisis proyek Anda. Tim kami akan segera menghubungi Anda.`,
            sender: 'ai',
            timestamp: new Date()
          }
        ]);
      }
      
      setIsLoading(false);
    };

    analyzeProject();
  }, [formData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 8c2.64 0 4.82-1.43 5.67-3.43.85-2 .04-4.33-1.96-4.33H8.29c-2 0-2.81 2.33-1.96 4.33C7.18 6.57 9.36 8 12 8z"/>
                <path d="M4.29 8.13c-2.58 1.72-3.07 5-1.24 7.87 1.84 2.87 5.26 3.87 7.87 2.87h.19c2.4 0 4.9-.9 6.5-2.87 1.84-2 1.5-5.5-.25-7.5M12 12v4M12 16h4M8 16h2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">AI Assisten Proyek</h3>
          </div>
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="sm"
            className="border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Tutup
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">AI sedang menganalisis proyek Anda...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Menganalisis jenis proyek, fitur, dan anggaran Anda</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    message.sender === 'ai' 
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-gray-700 dark:to-gray-700 border border-purple-200 dark:border-gray-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border border-blue-600'
                  }`}
                >
                  {message.text.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-3 last:mb-0 leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <Textarea 
              placeholder="Tanyakan lebih lanjut tentang proyek Anda..." 
              className="flex-1 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              disabled
            />
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md"
              disabled
            >
              Kirim
            </Button>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-xs text-gray-500">AI Aktif</span>
            </div>
            <p className="text-xs text-gray-500 flex-1">Tim kami akan segera menghubungi Anda untuk diskusi lebih lanjut</p>
          </div>
        </div>
      </div>
    </div>
  );
}