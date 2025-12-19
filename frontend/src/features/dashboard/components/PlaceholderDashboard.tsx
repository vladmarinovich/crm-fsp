import { Card } from '@/components/ui/Card';

interface PlaceholderDashboardProps {
    title: string;
    description: string;
    icon: string;
}

export const PlaceholderDashboard = ({ title, description, icon }: PlaceholderDashboardProps) => {
    return (
        <div className="space-y-6">
            <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-700">{title}</h2>
                <p className="text-sm text-slate-500">{description}</p>
            </div>

            <Card className="p-12">
                <div className="text-center">
                    <div className="text-6xl mb-4">{icon}</div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">Próximamente</h3>
                    <p className="text-slate-500">
                        Este dashboard está en desarrollo y estará disponible pronto.
                    </p>
                </div>
            </Card>
        </div>
    );
};
