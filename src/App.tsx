import { useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Project } from './types/project';
import { ProjectCard } from './components/ProjectCard';
import { ProjectForm } from './components/ProjectForm';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('3d-printing-projects', []);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterDelivered, setFilterDelivered] = useState<'all' | 'active' | 'delivered'>('all');

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...projectData, id: editingProject.id, createdAt: editingProject.createdAt }
            : p
        )
      );
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter((project) => {
    if (filterDelivered === 'active') return !project.deliveredDate;
    if (filterDelivered === 'delivered') return !!project.deliveredDate;
    return true;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => !p.deliveredDate).length,
    delivered: projects.filter((p) => !!p.deliveredDate).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Control de Proyectos 3D</h1>
                <p className="text-gray-600 mt-1">Gestiona tus proyectos de impresión 3D</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nuevo Proyecto
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Proyectos</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">En Proceso</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Entregados</h3>
            <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterDelivered('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterDelivered === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterDelivered('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterDelivered === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            En Proceso
          </button>
          <button
            onClick={() => setFilterDelivered('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterDelivered === 'delivered'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Entregados
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Printer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay proyectos
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando tu primer proyecto de impresión 3D
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Crear Proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default App;
