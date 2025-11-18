'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calendar, Save, X, CheckCircle, Circle, Copy } from 'lucide-react';
import { Project as DbProject, ProjectMilestone } from '@/lib/landing-page-db';

// Define a local Project type that extends the DB type with our formatted date
interface Project extends DbProject {
  estimatedCompletionFormatted?: string | null;
}

interface ProjectProgressFeatureProps {
  projects: Project[];
  milestones: ProjectMilestone[];
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'estimatedCompletionFormatted'>) => void;
}

export default function ProjectProgressFeature({ 
  projects, 
  milestones, // Add milestones to props
  onUpdateProject, 
  onDeleteProject, 
  onCreateProject 
}: ProjectProgressFeatureProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    client_name: '',
    project_name: '',
    description: '',
    status: 'Diskusi' as 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai',
    estimated_completion: ''
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const projectStatuses = [
    { value: 'Diskusi', label: 'Diskusi', percentage: 10 },
    { value: 'Desain', label: 'Desain', percentage: 30 },
    { value: 'Development', label: 'Development', percentage: 60 },
    { value: 'Test', label: 'Test', percentage: 90 },
    { value: 'Selesai', label: 'Selesai', percentage: 100 },
  ];

  const calculateProgress = (status: string) => {
    const statusObj = projectStatuses.find(s => s.value === status);
    return statusObj ? statusObj.percentage : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Test': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Development': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'Desain': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'Diskusi': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleSave = async () => {
    if (editingProject) {
      console.log('Saving project with status:', editingProject.status); // Debugging log
      // Capture the original status before update
      const originalProject = projects.find(p => p.id === editingProject.id);
      const originalStatus = originalProject?.status;
      const newStatus = editingProject.status;
      
      // Only send WhatsApp notification if status has changed
      if (originalStatus && originalStatus !== newStatus) {
        // Send notification to client about status change
        try {
          // In real implementation, you might fetch client phone number from a related table
          // For now, this is a placeholder
          console.log(`Sending status update to client for project ${editingProject.project_name}: ${originalStatus} → ${newStatus}`);
          
          // Call our API to send WhatsApp notification
          await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editingProject.client_name,
              phone_number: 'CLIENT_PHONE_NUMBER', // Would need to be retrieved from database
              service_type: 'Project Update',
              project_description: `Status project ${editingProject.project_name} telah diperbarui dari ${projectStatuses.find(s => s.value === originalStatus)?.label} ke ${projectStatuses.find(s => s.value === newStatus)?.label}`,
              businessNumber: '+6283117927964'
            }),
          });
        } catch (error) {
          console.error('Error sending status update notification:', error);
        }
      }
      
      await onUpdateProject(editingProject);
      setEditingProject(null);
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  const handleAddProject = async () => {
    await onCreateProject(newProject);
    setNewProject({
      client_name: '',
      project_name: '',
      description: '',
      status: 'Diskusi', // Default to "Diskusi"
      estimated_completion: ''
    });
    setShowAddForm(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [field]: value
      });
    }
  };

  const handleNewProjectChange = (field: string, value: any) => {
    setNewProject({
      ...newProject,
      [field]: value
    });
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Progress Tracking</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name</Label>
                  <Input
                    id="client_name"
                    value={newProject.client_name}
                    onChange={(e) => handleNewProjectChange('client_name', e.target.value)}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name</Label>
                  <Input
                    id="project_name"
                    value={newProject.project_name}
                    onChange={(e) => handleNewProjectChange('project_name', e.target.value)}
                    placeholder="Project name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => handleNewProjectChange('description', e.target.value)}
                  placeholder="Project description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai') => handleNewProjectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_completion">Estimated Completion</Label>
                  <Input
                    id="estimated_completion"
                    type="date"
                    value={newProject.estimated_completion}
                    onChange={(e) => handleNewProjectChange('estimated_completion', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddProject}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{project.short_id || '-'}</span>
                      {project.short_id && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(project.short_id!)}>
                          {copiedId === project.short_id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingProject?.id === project.id ? (
                      <Input
                        value={editingProject.client_name}
                        onChange={(e) => handleInputChange('client_name', e.target.value)}
                      />
                    ) : (
                      project.client_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProject?.id === project.id ? (
                      <Input
                        value={editingProject.project_name}
                        onChange={(e) => handleInputChange('project_name', e.target.value)}
                      />
                    ) : (
                      project.project_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProject?.id === project.id ? (
                      <Textarea
                        value={editingProject.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    ) : (
                      <div className="max-w-xs truncate">{project.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProject?.id === project.id ? (
                      <Select
                        value={editingProject.status as any}
                        onValueChange={(value: 'Diskusi' | 'Desain' | 'Development' | 'Test' | 'Selesai') => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectStatuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getStatusColor(project.status)}>
                        {projectStatuses.find(s => s.value === project.status)?.label || project.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={calculateProgress(project.status)} className="w-24" />
                      <span className="text-sm">{calculateProgress(project.status)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.estimatedCompletionFormatted ? (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {project.estimatedCompletionFormatted}
                      </div>
                    ) : (
                      <span className="text-gray-500">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingProject?.id === project.id ? (
                        <>
                          <Button variant="outline" size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onDeleteProject(project.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}