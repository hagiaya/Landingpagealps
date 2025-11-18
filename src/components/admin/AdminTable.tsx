'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2, Plus, Search, Save, X } from 'lucide-react';

interface TableAction {
  label: string;
  onClick: (item: any) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

interface AdminTableProps<T> {
  data: T[];
  columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[];
  actions?: TableAction[];
  title?: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchFields?: string[];
  addLabel?: string;
  emptyMessage?: string;
}

export default function AdminTable<T>({
  data,
  columns,
  actions = [],
  title,
  onAdd,
  onEdit,
  onDelete,
  searchFields = [],
  addLabel = 'Add',
  emptyMessage = 'No data available'
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  // Filter data based on search term if search fields are provided
  const filteredData = searchTerm
    ? data.filter(item => {
        return searchFields.some(field => {
          const value = String((item as any)[field] || '').toLowerCase();
          return value.includes(searchTerm.toLowerCase());
        });
      })
    : data;

  const handleEdit = (item: T, idField: string = 'id') => {
    const itemId = (item as any)[idField];
    setEditingId(itemId);
    // Initialize edit data with current values
    const newData: Record<string, any> = {};
    columns.forEach(col => {
      newData[col.key] = (item as any)[col.key];
    });
    setEditData(newData);
  };

  const handleSave = () => {
    if (onEdit && editingId) {
      // Find the original item in the data array
      const originalItem = data.find(item => (item as any).id === editingId);
      if (originalItem) {
        onEdit({ ...originalItem, ...editData });
      }
    }
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (key: string, value: any) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {searchFields.length > 0 && (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          )}
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[60vh]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {(actions.length > 0 || onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + ((actions.length > 0 || onEdit || onDelete) ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item: any, index: number) => {
                const itemId = item.id;
                const isEditing = editingId === itemId;
                
                return (
                  <TableRow key={itemId || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {isEditing ? (
                          <Input
                            value={editData[column.key] ?? ''}
                            onChange={(e) => handleInputChange(column.key, e.target.value)}
                          />
                        ) : column.render ? (
                          column.render(item)
                        ) : (
                          String(item[column.key] || '')
                        )}
                      </TableCell>
                    ))}
                    {(actions.length > 0 || onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {onEdit && !isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {isEditing && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSave}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {onDelete && !isEditing && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {actions.map((action, idx) => (
                            <Button
                              key={idx}
                              variant={action.variant || "outline"}
                              size="sm"
                              onClick={() => action.onClick(item)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}