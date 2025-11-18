'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Mail, Phone, Check, Trash2 } from 'lucide-react';
import { LeadSubmission } from '@/lib/landing-page-db'; // Import LeadSubmission

interface LeadRowProps {
  lead: LeadSubmission; // Use the imported LeadSubmission type
  serviceLabel: string; // Pre-computed service label
  submittedAtFormatted: string;
}

export default function LeadRow({ lead, serviceLabel, submittedAtFormatted }: LeadRowProps) {
  // State for updating lead status
  const [isProcessed, setIsProcessed] = useState(lead.processed);

  const toggleProcessed = async () => {
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processed: !isProcessed }),
      });

      if (response.ok) {
        setIsProcessed(!isProcessed);
      } else {
        console.error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const deleteLead = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page or remove the row
        window.location.reload();
      } else {
        console.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const convertToProject = async () => {
    if (!confirm(`Convert this lead to a project?\n\nClient: ${lead.name}\nService: ${serviceLabel}`)) {
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: lead.name,
          project_name: `${serviceLabel} Project for ${lead.name}`,
          description: lead.project_description || 'Project based on lead inquiry',
          status: 'Diskusi', // Start with 'Diskusi' status
          estimated_completion: null,
          short_id: lead.short_id, // Pass the short_id
        }),
      });

      if (response.ok) {
        // Mark the lead as processed when converted to project
        if (!isProcessed) {
          await fetch(`/api/leads/${lead.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ processed: true }),
          });
        }
        
        // Refresh the page
        window.location.reload();
      } else {
        alert('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  return (
    <tr>
      <td className="font-medium">{lead.name}</td>
      <td>{lead.address}</td>
      <td>
        <Badge variant="outline">
          {serviceLabel}
        </Badge>
      </td>
      <td>
        {lead.features ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="text-xs font-semibold">F</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Requested Features</DialogTitle>
              <div className="py-2 max-h-60 overflow-y-auto">
                {lead.features}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td>
        {lead.budget ? (
          <Badge variant={lead.budget.startsWith('less-than') ? 'secondary' :
                        lead.budget.startsWith('more-than') ? 'default' : 'outline'}>
            {lead.budget === 'less-than-5jt' ? '< Rp 5jt' :
             lead.budget === '5jt-10jt' ? 'Rp 5jt-10jt' :
             lead.budget === '10jt-25jt' ? 'Rp 10jt-25jt' :
             lead.budget === '25jt-50jt' ? 'Rp 25jt-50jt' :
             lead.budget === 'more-than-50jt' ? '> Rp 50jt' :
             lead.budget === 'not-sure' ? 'Tidak yakin' : lead.budget}
          </Badge>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td>
        {lead.project_description ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="text-xs font-semibold">P</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Project Description</DialogTitle>
              <div className="py-2 max-h-60 overflow-y-auto">
                {lead.project_description}
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td>
        {lead.phone_number ? (
          <a
            href={`https://wa.me/${lead.phone_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <Phone className="h-4 w-4 mr-1" /> {lead.phone_number}
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td>
        {submittedAtFormatted}
      </td>
      <td>
        <Badge variant={isProcessed ? "default" : "secondary"}>
          {isProcessed ? "Processed" : "New"}
        </Badge>
      </td>
      <td className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact via WhatsApp
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Contact {lead.name}</DialogTitle>
                <DialogDescription>
                  Send a message to {lead.name} regarding their inquiry.
                </DialogDescription>
                <div className="py-4 space-y-2">
                  <p><span className="font-medium">Service:</span> {serviceLabel}</p>
                  <p><span className="font-medium">Address:</span> {lead.address}</p>
                  <p><span className="font-medium">Features:</span> {lead.features || '-'}</p>
                  <p><span className="font-medium">Budget:</span> {lead.budget ?
                    (lead.budget === 'less-than-5jt' ? '< Rp 5jt' :
                     lead.budget === '5jt-10jt' ? 'Rp 5jt-10jt' :
                     lead.budget === '10jt-25jt' ? 'Rp 10jt-25jt' :
                     lead.budget === '25jt-50jt' ? 'Rp 25jt-50jt' :
                     lead.budget === 'more-than-50jt' ? '> Rp 50jt' :
                     lead.budget === 'not-sure' ? 'Tidak yakin' : lead.budget) : '-'}</p>
                  {lead.project_description && (
                    <p><span className="font-medium">Project:</span> {lead.project_description}</p>
                  )}
                  <p><span className="font-medium">Phone:</span> {lead.phone_number}</p>
                  <p><span className="font-medium">Submitted:</span> {submittedAtFormatted}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <a
                      href={`https://wa.me/${(lead.phone_number || '').replace(/\D/g, '')}?text=Halo ${encodeURIComponent(lead.name)}, terima kasih atas inquiry Anda. Saya ingin membahas proyek ${encodeURIComponent(serviceLabel)} Anda, khususnya tentang fitur: ${encodeURIComponent(lead.features || 'tidak ada spesifikasi')}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send WhatsApp
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem asChild>
              <button onClick={convertToProject} className="flex items-center w-full text-blue-600 focus:text-blue-600">
                <Check className="h-4 w-4 mr-2" />
                Convert to Project
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={toggleProcessed} className="flex items-center w-full">
                <Check className="h-4 w-4 mr-2" />
                Mark as {isProcessed ? 'Unprocessed' : 'Processed'}
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              asChild
            >
              <button onClick={deleteLead} className="flex items-center w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}