import React, { useState } from 'react';
import { Camera, Upload, Save } from 'lucide-react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

interface PassportData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  issue_date: string;
  expiry_date: string;
  photo: string | null;
}

export default function PassportForm() {
  const [formData, setFormData] = useState<PassportData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    passport_number: '',
    issue_date: '',
    expiry_date: '',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkPassportNumberExists = async (passportNumber: string) => {
    const { data, error } = await supabase
      .from('passports')
      .select('passport_number')
      .eq('passport_number', passportNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation des champs requis
      if (!formData.first_name || !formData.last_name || !formData.passport_number) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Vérifier si le numéro de passeport existe déjà
      const exists = await checkPassportNumberExists(formData.passport_number);
      if (exists) {
        throw new Error('Ce numéro de passeport existe déjà dans la base de données');
      }

      const { data, error } = await supabase
        .from('passports')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Passeport enregistré avec succès!');
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        nationality: '',
        passport_number: '',
        issue_date: '',
        expiry_date: '',
        photo: null
      });
      
    } catch (err) {
      console.error('Error:', err);
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('passport-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('passport-photos')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        photo: publicUrl
      }));
      
      toast.success('Photo téléchargée avec succès!');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Erreur lors du téléchargement de la photo');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-center space-x-2">
          <Camera className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Enregistrement de Passeport</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nationalité</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de passeport</label>
            <input
              type="text"
              name="passport_number"
              value={formData.passport_number}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'émission</label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}