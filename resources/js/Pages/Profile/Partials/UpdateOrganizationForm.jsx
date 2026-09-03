import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdateOrganizationForm({ organization, className = '' }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: organization?.name || '',
        short_code: organization?.short_code || '',
        logo: null,
        _method: 'POST',
    });

    const [logoPreview, setLogoPreview] = useState(organization?.logo_url || null);

    const submit = (e) => {
        e.preventDefault();
        post(route('organization.update'), { preserveScroll: true, forceFormData: true });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900">
                    Organization Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Update your coaching center's name, short code (for generating Student IDs), and upload an official logo for ID cards.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div className="flex items-center gap-6">
                    <div>
                        {logoPreview ? (
                            <img src={logoPreview} alt="Organization Logo" className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center border border-dashed border-gray-300">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 10l3 3m0 0l3-3m-3 3V3" /></svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <InputLabel value="Coaching Center Logo" className="mb-1" />
                        <label className="cursor-pointer px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-400 bg-white transition-colors shadow-sm inline-block">
                            <span>Choose Logo...</span>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </label>
                        <p className="text-xs text-gray-400 mt-1.5">This will be printed on Student ID cards.</p>
                        <InputError className="mt-2" message={errors.logo} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="org_name" value="Coaching Center Name" />
                    <TextInput
                        id="org_name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="short_code" value="ID Prefix (Short Code)" />
                    <TextInput
                        id="short_code"
                        className="mt-1 block w-full"
                        value={data.short_code}
                        onChange={(e) => setData('short_code', e.target.value)}
                        placeholder="e.g. ABC"
                        maxLength="10"
                    />
                    <p className="text-xs text-gray-400 mt-1">If empty, we'll auto-generate it using the first letters of the coaching center's name.</p>
                    <InputError className="mt-2" message={errors.short_code} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save Organization</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-500 font-medium">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
