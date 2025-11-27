import { GastoForm } from '../components/GastoForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const CreateGastoPage = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/gastos')}
                    className="p-2 h-auto rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nuevo Gasto</h1>
                    <p className="text-sm text-slate-500">Registra un nuevo egreso o pago.</p>
                </div>
            </div>

            <Card className="p-6 border-slate-200 shadow-sm">
                <GastoForm />
            </Card>
        </div>
    );
};
