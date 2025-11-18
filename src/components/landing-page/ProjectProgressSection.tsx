'use client';

import { useState } from 'react';
import { Project, ProjectMilestone } from '@/lib/landing-page-db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Clock, Circle } from 'lucide-react';

type ProjectStatus = 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai';

interface ProjectProgressSectionProps {
  projects: (Project & { estimatedCompletionFormatted?: string | null })[];
  milestones: (ProjectMilestone & { dueDateFormatted: string })[];
}

const timelineSteps: { name: ProjectStatus; percentage: number }[] = [
  { name: 'Diskusi', percentage: 10 },
  { name: 'Desain', percentage: 30 },
  { name: 'Development', percentage: 60 },
  { name: 'Test', percentage: 90 },
  { name: 'Selesai', percentage: 100 },
];

export default function ProjectProgressSection({ projects }: ProjectProgressSectionProps) {
  const [searchId, setSearchId] = useState('');
  const [searchedProject, setSearchedProject] = useState< (Project & { estimatedCompletionFormatted?: string | null }) | null | undefined >(null);

  const getProjectProgress = (status: ProjectStatus) => {
    const step = timelineSteps.find(s => s.name === status);
    if (!step) return 0;
    const currentIndex = timelineSteps.findIndex(s => s.name === status);
    if (status === 'Selesai') return 100;
    return timelineSteps[currentIndex]?.percentage || 0;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchedProject(null);
      return;
    }
    
    const foundProject = projects.find(p => p.short_id?.toLowerCase() === searchId.toLowerCase());
    setSearchedProject(foundProject || undefined); // Set to undefined if not found
  };

  const renderTimeline = (currentStatus: ProjectStatus) => {
    const currentIndex = timelineSteps.findIndex(step => step.name === currentStatus);
    
    return (
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          let status: 'completed' | 'in_progress' | 'pending' = 'pending';
          if (index < currentIndex) {
            status = 'completed';
          } else if (index === currentIndex) {
            status = 'in_progress';
          }

          return (
            <div key={step.name} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'completed' ? 'bg-green-500 text-white' :
                  status === 'in_progress' ? 'bg-blue-500 text-white' :
                  'bg-gray-200'
                }`}>
                  {status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                   status === 'in_progress' ? <Clock className="h-4 w-4" /> :
                   <Circle className="h-4 w-4 text-gray-400" />}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className={`w-0.5 h-full mt-1 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
              <div className="pb-4 flex-1">
                <h5 className="font-medium">{step.name}</h5>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Cek Progres Project</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Masukkan ID Project unik Anda yang diberikan oleh tim kami untuk melihat progres pengerjaan project Anda secara real-time.
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Masukkan ID Project Anda..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              aria-label="Project ID"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cek Progres
            </button>
          </form>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {searchedProject === undefined && (
            <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-lg text-red-600 dark:text-red-400">Project tidak ditemukan.</p>
              <p className="text-sm text-muted-foreground mt-1">Pastikan ID yang Anda masukkan sudah benar.</p>
            </div>
          )}

          {searchedProject && (
            <Card>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{searchedProject.project_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{searchedProject.client_name}</p>
                  </div>
                  <Badge 
                    variant={searchedProject.status === 'Selesai' ? 'default' : 'secondary'}
                  >
                    {searchedProject.status}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{getProjectProgress(searchedProject.status as ProjectStatus)}%</span>
                  </div>
                  <Progress value={getProjectProgress(searchedProject.status as ProjectStatus)} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-4">Timeline Proyek:</h4>
                {renderTimeline(searchedProject.status as ProjectStatus)}
                {searchedProject.estimatedCompletionFormatted && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm">
                      <span className="font-medium">Estimasi Selesai:</span>{' '}
                      {searchedProject.estimatedCompletionFormatted}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}