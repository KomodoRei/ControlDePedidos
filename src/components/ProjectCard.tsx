import { Edit2, Trash2, Calendar, DollarSign, Package } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isDelivered = !!project.deliveredDate;
  const pending = project.total - project.deposit;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {project.image && (
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 flex-1">{project.title}</h3>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
                  onDelete(project.id);
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isDelivered && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Entregado
          </span>
        )}

        <div className="space-y-3 text-sm">
          {project.size && (
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4" />
              <span>Tamaño: {project.size}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span>Cantidad: {project.quantity}</span>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(project.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Abono:</span>
              <span className="font-medium text-gray-700">{formatCurrency(project.deposit)}</span>
            </div>
            {pending > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pendiente:</span>
                <span className="font-semibold text-orange-600">{formatCurrency(pending)}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Pedido: {formatDate(project.orderDate)}</span>
            </div>
            {project.estimatedDeliveryDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Entrega estimada: {formatDate(project.estimatedDeliveryDate)}</span>
              </div>
            )}
            {project.deliveredDate && (
              <div className="flex items-center gap-2 text-green-600">
                <Calendar className="w-4 h-4" />
                <span>Entregado: {formatDate(project.deliveredDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
