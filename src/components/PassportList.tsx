import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Search, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Passport {
  id: string;
  first_name: string;
  last_name: string;
  passport_number: string;
  nationality: string;
  date_of_birth: string;
  issue_date: string;
  expiry_date: string;
  photo: string;
}

export default function PassportList() {
  const [passports, setPassports] = useState<Passport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<Passport | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Passport | null>(null);

  useEffect(() => {
    fetchPassports();
  }, []);

  const fetchPassports = async () => {
    try {
      const { data, error } = await supabase
        .from('passports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPassports(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (passport: Passport) => {
    setSelectedPassport(passport);
    setIsViewModalOpen(true);
  };

  const handleEdit = (passport: Passport) => {
    setEditFormData(passport);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData) return;

    try {
      const { error } = await supabase
        .from('passports')
        .update(editFormData)
        .eq('id', editFormData.id);

      if (error) throw error;

      setPassports(passports.map(p => 
        p.id === editFormData.id ? editFormData : p
      ));
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating passport');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce passeport ?')) return;

    try {
      const { error } = await supabase
        .from('passports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPassports(passports.filter(passport => passport.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting passport');
    }
  };

  const filteredPassports = passports.filter(passport =>
    `${passport.first_name} ${passport.last_name} ${passport.passport_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Liste des Passeports</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Passeport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationalité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPassports.map((passport) => (
                <tr key={passport.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={passport.photo || 'https://via.placeholder.com/150'}
                      alt={`${passport.first_name} ${passport.last_name}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {passport.first_name} {passport.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{passport.passport_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{passport.nationality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(passport.expiry_date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleView(passport)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(passport)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(passport.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{filteredPassports.length}</span> passeports
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedPassport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Détails du Passeport</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <img
                src={selectedPassport.photo || 'https://via.placeholder.com/150'}
                alt={`${selectedPassport.first_name} ${selectedPassport.last_name}`}
                className="w-32 h-32 rounded-lg mx-auto object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-500">Nom complet</p>
                <p className="text-sm text-gray-900">{selectedPassport.first_name} {selectedPassport.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                <p className="text-sm text-gray-900">{new Date(selectedPassport.date_of_birth).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nationalité</p>
                <p className="text-sm text-gray-900">{selectedPassport.nationality}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de passeport</p>
                <p className="text-sm text-gray-900">{selectedPassport.passport_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'émission</p>
                <p className="text-sm text-gray-900">{new Date(selectedPassport.issue_date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'expiration</p>
                <p className="text-sm text-gray-900">{new Date(selectedPassport.expiry_date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editFormData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Modifier le Passeport</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={editFormData.first_name}
                  onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={editFormData.last_name}
                  onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                <input
                  type="text"
                  value={editFormData.nationality}
                  onChange={(e) => setEditFormData({...editFormData, nationality: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                <input
                  type="date"
                  value={editFormData.expiry_date}
                  onChange={(e) => setEditFormData({...editFormData, expiry_date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}