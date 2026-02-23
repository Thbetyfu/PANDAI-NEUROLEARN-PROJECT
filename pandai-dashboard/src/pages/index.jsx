import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronDown, User, Lock } from 'lucide-react';
import Head from 'next/head';
import PandaLogo from '@/components/icons/PandaLogo';
import PandaiTextLogo from '@/components/icons/PandaiTextLogo';
import GradientTitle from '@/components/ui/GradientTitle';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const roles = [
        { id: 'guru', label: 'Guru' },
        { id: 'waka', label: 'Waka Kesiswaan' },
        { id: 'orang_tua', label: 'Orang Tua' },
    ];

    const handleNext = () => {
        if (selectedRole) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
        setEmail('');
        setPassword('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const targetPath = {
            guru: '/guru',
            waka: '/waka',
            orang_tua: '/orang-tua'
        }[selectedRole];

        if (targetPath) {
            router.push(targetPath);
        }
    };

    const getRoleLabel = () => {
        return roles.find(r => r.id === selectedRole)?.label || '';
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans bg-[#F8F8F8]">
            <Head>
                <title>Login - Pandai</title>
            </Head>

            {/* Main Card Container - Dynamic Width */}
            <div className={`relative z-10 transition-all duration-300 ease-in-out ${step === 1 ? 'w-[422px]' : 'w-[396px]'} max-w-full`}>
                {/* 
                   Card Design Recreation:
                   - Glassy/White transparent background
                   - White Border with rounded corners
                   - Drop Shadow 
                */}
                <div className="relative bg-white/50 backdrop-blur-md border-2 border-white rounded-[12px] p-8 shadow-2xl transition-all duration-300">

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="flex flex-col">
                            {/* Logo Section */}
                            <div className="flex items-center gap-3 mb-2">
                                <PandaLogo className="w-[30px] h-[30px]" />
                                <PandaiTextLogo className="h-[17px] w-auto" />
                            </div>

                            <GradientTitle>Role Login</GradientTitle>
                            <p className="text-sm text-[#616161] mb-8 font-medium leading-relaxed font-['Inter']">
                                Untuk menentukan sebagai apa anda melakukan login.
                            </p>



                            {/* Role Select */}
                            <Select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                options={roles}
                                placeholder="Pilih Role Anda"
                                className="mb-8"
                            />

                            <Button
                                onClick={handleNext}
                                disabled={!selectedRole}
                                className="py-3.5"
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Login Form - Refined Layout based on SVG */}
                    {step === 2 && (
                        <div className="flex flex-col">
                            {/* Logo Section */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-1 text-[#616161] hover:text-[#001D5A] text-sm font-bold transition-colors font-['Inter']"
                                >
                                    <ChevronLeft size={20} strokeWidth={3} />
                                    Kembali
                                </button>
                            </div>

                            <div className="mb-6">
                                <GradientTitle>Login {getRoleLabel()}</GradientTitle>
                                <p className="text-sm text-[#616161] font-medium font-['Inter']">
                                    Isi data berikut untuk login
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email Input */}
                                <div className="space-y-1">
                                    <Input
                                        icon={User}
                                        type="email"
                                        placeholder="User ID / Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1">
                                    <Input
                                        icon={Lock}
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 py-3"
                                >
                                    Login
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
