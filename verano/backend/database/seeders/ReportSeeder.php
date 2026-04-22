<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\ReportImage;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        // ── Usuarios falsos ──────────────────────────────────────────
        $users = [
            ['name' => 'Laura Gómez',    'email' => 'laura@test.com'],
            ['name' => 'Martín Pérez',   'email' => 'martin@test.com'],
            ['name' => 'Sofía Rodríguez','email' => 'sofia@test.com'],
            ['name' => 'Diego Fernández','email' => 'diego@test.com'],
        ];

        $createdUsers = [];
        foreach ($users as $data) {
            $createdUsers[] = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password123'),
                    'role'     => 'user',
                ]
            );
        }

        // ── Reportes ─────────────────────────────────────────────────
        $reports = [
            [
                'summary'     => 'Bache profundo en Av. Argentina',
                'description' => 'Hay un bache de aproximadamente 40cm de diámetro y 15cm de profundidad en la Av. Argentina al 1200. Ya dañó varios vehículos y es peligroso para las motos.',
                'category'    => 'tránsito',
                'priority'    => 'high',
                'lat'         => -38.9516,
                'lng'         => -68.0591,
                'address'     => 'Av. Argentina 1200, Neuquén',
            ],
            [
                'summary'     => 'Semáforo apagado en intersección',
                'description' => 'El semáforo de la esquina de Félix San Martín y Roca lleva 3 días apagado. Se producen embotellamientos y casi hubo un accidente esta mañana.',
                'category'    => 'servicios',
                'priority'    => 'high',
                'lat'         => -38.9522,
                'lng'         => -68.0605,
                'address'     => 'Félix San Martín y Roca, Neuquén',
            ],
            [
                'summary'     => 'Luminaria quemada hace semanas',
                'description' => 'La cuadra de Belgrano entre Rivadavia y Alderete está completamente a oscuras de noche. Ya lo reportamos dos veces y no mandan a arreglarla.',
                'category'    => 'alumbrado',
                'priority'    => 'medium',
                'lat'         => -38.9508,
                'lng'         => -68.0582,
                'address'     => 'Belgrano 850, Neuquén',
            ],
            [
                'summary'     => 'Basura acumulada en esquina',
                'description' => 'Desde hace más de una semana hay bolsas de basura acumuladas en la esquina de Antártida Argentina y Mitre. El olor es insoportable y atrae animales.',
                'category'    => 'higiene',
                'priority'    => 'medium',
                'lat'         => -38.9499,
                'lng'         => -68.0617,
                'address'     => 'Antártida Argentina y Mitre, Neuquén',
            ],
            [
                'summary'     => 'Pérdida de agua en la calle',
                'description' => 'Hay agua brotando del asfalto en Roca al 600. Parece una cañería rota debajo de la calle. El agua lleva al menos 48 horas corriendo.',
                'category'    => 'servicios',
                'priority'    => 'high',
                'lat'         => -38.9541,
                'lng'         => -68.0634,
                'address'     => 'Roca 600, Neuquén',
            ],
            [
                'summary'     => 'Árbol caído sobre la vereda',
                'description' => 'Un árbol grande cayó sobre la vereda de Alderete al 400 tras el viento de anoche. Bloquea el paso peatonal y parte de la calle. Hay cables cercanos.',
                'category'    => 'infraestructura',
                'priority'    => 'high',
                'lat'         => -38.9535,
                'lng'         => -68.0558,
                'address'     => 'Alderete 400, Neuquén',
            ],
            [
                'summary'     => 'Vereda rota con riesgo de caída',
                'description' => 'Las baldosas de la vereda de Av. Olascoaga al 900 están levantadas y rotas. Una señora mayor se cayó ayer. Es urgente el arreglo.',
                'category'    => 'infraestructura',
                'priority'    => 'medium',
                'lat'         => -38.9487,
                'lng'         => -68.0599,
                'address'     => 'Av. Olascoaga 900, Neuquén',
            ],
            [
                'summary'     => 'Grafiti en edificio municipal',
                'description' => 'Aparecieron grafitis en la fachada del edificio de la biblioteca municipal sobre Roca. Está muy visible y afecta la imagen del centro.',
                'category'    => 'vandalismo',
                'priority'    => 'low',
                'lat'         => -38.9512,
                'lng'         => -68.0621,
                'address'     => 'Biblioteca Municipal, Roca, Neuquén',
            ],
            [
                'summary'     => 'Auto abandonado hace meses',
                'description' => 'Hay un auto sin patente y sin ruedas estacionado sobre la calle Yrigoyen al 1100. Lleva al menos 3 meses ahí y nadie lo retira.',
                'category'    => 'tránsito',
                'priority'    => 'low',
                'lat'         => -38.9528,
                'lng'         => -68.0577,
                'address'     => 'Yrigoyen 1100, Neuquén',
            ],
            [
                'summary'     => 'Contenedor de basura quemado',
                'description' => 'El contenedor de residuos de la plaza San Martín fue incendiado. Quedó completamente destruido y nadie lo reemplazó todavía.',
                'category'    => 'higiene',
                'priority'    => 'medium',
                'lat'         => -38.9503,
                'lng'         => -68.0609,
                'address'     => 'Plaza San Martín, Neuquén',
            ],
            [
                'summary'     => 'Señal de tránsito doblada',
                'description' => 'La señal de PARE en la esquina de Brown y Rioja está totalmente doblada y no se puede leer. Es peligroso porque es una intersección con mucho tráfico.',
                'category'    => 'tránsito',
                'priority'    => 'medium',
                'lat'         => -38.9544,
                'lng'         => -68.0588,
                'address'     => 'Brown y Rioja, Neuquén',
            ],
            [
                'summary'     => 'Zanjón destapado sin señalización',
                'description' => 'Abrieron un zanjón en Diagonal 9 de Julio al 500 para obras y lo dejaron sin tapar ni señalizar. Es peligroso de noche.',
                'category'    => 'infraestructura',
                'priority'    => 'high',
                'lat'         => -38.9491,
                'lng'         => -68.0641,
                'address'     => 'Diagonal 9 de Julio 500, Neuquén',
            ],
            [
                'summary'     => 'Perros sueltos en parque',
                'description' => 'Hay una jauría de entre 6 y 8 perros sueltos en el Parque Central que asustaron a varios chicos. Ya mordieron a un perro doméstico.',
                'category'    => 'seguridad',
                'priority'    => 'medium',
                'lat'         => -38.9476,
                'lng'         => -68.0563,
                'address'     => 'Parque Central, Neuquén',
            ],
            [
                'summary'     => 'Poste de luz inclinado',
                'description' => 'El poste de alumbrado en Salta al 300 está muy inclinado, casi 30 grados. Parece que la base está podrida. Riesgo de caída.',
                'category'    => 'alumbrado',
                'priority'    => 'high',
                'lat'         => -38.9557,
                'lng'         => -68.0574,
                'address'     => 'Salta 300, Neuquén',
            ],
            [
                'summary'     => 'Pintadas en parada de colectivo',
                'description' => 'La parada de colectivo de la línea 5 sobre Av. Independencia está cubierta de grafitis y algunas pintadas con lenguaje inapropiado.',
                'category'    => 'vandalismo',
                'priority'    => 'low',
                'lat'         => -38.9519,
                'lng'         => -68.0596,
                'address'     => 'Av. Independencia, parada línea 5, Neuquén',
            ],
            [
                'summary'     => 'Fuga de gas en edificio',
                'description' => 'Se huele fuertemente a gas en el pasillo del edificio de Perito Moreno 720. Ya llamamos a la empresa pero dicen que tardarán horas.',
                'category'    => 'servicios',
                'priority'    => 'high',
                'lat'         => -38.9533,
                'lng'         => -68.0612,
                'address'     => 'Perito Moreno 720, Neuquén',
            ],
            [
                'summary'     => 'Cámara de seguridad vandalized',
                'description' => 'Rompieron la cámara de seguridad municipal de la esquina de Brown y Av. Argentina. Era la única de esa zona.',
                'category'    => 'seguridad',
                'priority'    => 'medium',
                'lat'         => -38.9547,
                'lng'         => -68.0601,
                'address'     => 'Brown y Av. Argentina, Neuquén',
            ],
            [
                'summary'     => 'Inundación en subsuelo de edificio',
                'description' => 'Llueve hace dos días y el subsuelo del edificio de Ministro González al 400 se inundó. El agua viene de la calle por las bocas de tormenta tapadas.',
                'category'    => 'infraestructura',
                'priority'    => 'high',
                'lat'         => -38.9482,
                'lng'         => -68.0587,
                'address'     => 'Ministro González 400, Neuquén',
            ],
            [
                'summary'     => 'Juego roto en plaza infantil',
                'description' => 'El tobogán de la plaza de barrio Confluencia tiene la escalera rota. Un nene se cortó la semana pasada. Es necesario reemplazarlo.',
                'category'    => 'infraestructura',
                'priority'    => 'medium',
                'lat'         => -38.9471,
                'lng'         => -68.0618,
                'address'     => 'Plaza Barrio Confluencia, Neuquén',
            ],
            [
                'summary'     => 'Aceite derramado en calle mojada',
                'description' => 'Hay un derrame de aceite de motor en Córdoba al 800 que se extiende varios metros. Con la lluvia es muy resbaladizo y ya casi provoca un accidente.',
                'category'    => 'tránsito',
                'priority'    => 'high',
                'lat'         => -38.9526,
                'lng'         => -68.0569,
                'address'     => 'Córdoba 800, Neuquén',
            ],
        ];

        // ── Crear reportes con imágenes ───────────────────────────────
        Storage::disk('public')->makeDirectory('report-images');

        foreach ($reports as $i => $data) {
            $user = $createdUsers[$i % count($createdUsers)];

            // Distribuir reportes en los últimos 6 meses con algo de aleatoriedad
            $daysAgo = intval(($i / count($reports)) * 180) + rand(0, 14);
            $createdAt = now()->subDays($daysAgo)->subHours(rand(0, 23));

            $report = new Report([...$data, 'user_id' => $user->id]);
            $report->created_at = $createdAt;
            $report->updated_at = $createdAt;
            $report->save();

            // Descargar imagen aleatoria de picsum con seed fijo
            $this->attachImage($report, $i + 1);
        }

        $this->command->info('✓ 20 reportes creados con imágenes.');
    }

    private function attachImage(Report $report, int $seed): void
    {
        try {
            $url      = "https://picsum.photos/seed/{$seed}/800/500";
            $response = Http::timeout(10)->get($url);

            if (!$response->successful()) return;

            $filename = 'report-images/' . Str::uuid() . '.jpg';
            Storage::disk('public')->put($filename, $response->body());

            ReportImage::create([
                'report_id' => $report->id,
                'url'       => $filename,
            ]);
        } catch (\Exception $e) {
            // Si falla la descarga, el reporte queda sin imagen
            $this->command->warn("  imagen {$seed} no descargada: {$e->getMessage()}");
        }
    }
}
