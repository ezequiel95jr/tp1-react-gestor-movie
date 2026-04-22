<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Genera dos clusters de reportes para demostrar el mapa de calor:
 *   - Zona ROJA  (Av. Argentina / Perito Moreno): 6 reportes en ~50 m → intensidad alta
 *   - Zona AMARILLA (Barrio Belgrano): 4 reportes en ~60 m → intensidad media
 *
 * Ejecutar con:  php artisan db:seed --class=HeatmapSeeder
 */
class HeatmapSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo.heatmap@test.com'],
            [
                'name'     => 'Demo Heatmap',
                'password' => Hash::make('password123'),
                'role'     => 'user',
            ]
        );

        // ── ZONA ROJA — 6 reportes dentro de ~50 m ───────────────────
        // Centro aprox: Av. Argentina y Perito Moreno, Neuquén
        $zonaRoja = [
            [
                'lat'         => -38.9480,
                'lng'         => -68.0550,
                'summary'     => '[DEMO] Bache profundo en Av. Argentina',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'tránsito',
                'priority'    => 'high',
                'address'     => 'Av. Argentina 1100, Neuquén',
            ],
            [
                'lat'         => -38.9482,
                'lng'         => -68.0552,
                'summary'     => '[DEMO] Semáforo roto en intersección',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'servicios',
                'priority'    => 'high',
                'address'     => 'Av. Argentina y Tte. Ibáñez, Neuquén',
            ],
            [
                'lat'         => -38.9478,
                'lng'         => -68.0548,
                'summary'     => '[DEMO] Luminaria quemada — cuadra oscura',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'alumbrado',
                'priority'    => 'medium',
                'address'     => 'Perito Moreno 700, Neuquén',
            ],
            [
                'lat'         => -38.9481,
                'lng'         => -68.0547,
                'summary'     => '[DEMO] Basura acumulada en vereda',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'higiene',
                'priority'    => 'medium',
                'address'     => 'Perito Moreno 720, Neuquén',
            ],
            [
                'lat'         => -38.9479,
                'lng'         => -68.0553,
                'summary'     => '[DEMO] Vereda rota con baldosas levantadas',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'infraestructura',
                'priority'    => 'medium',
                'address'     => 'Av. Argentina 1080, Neuquén',
            ],
            [
                'lat'         => -38.9483,
                'lng'         => -68.0549,
                'summary'     => '[DEMO] Pérdida de agua en calzada',
                'description' => 'Zona de alta concentración de reportes — demo heatmap rojo.',
                'category'    => 'servicios',
                'priority'    => 'high',
                'address'     => 'Av. Argentina 1150, Neuquén',
            ],
        ];

        // ── ZONA AMARILLA — 4 reportes dentro de ~60 m ───────────────
        // Centro aprox: Barrio Belgrano, ~1.4 km al sur-oeste
        $zonaAmarilla = [
            [
                'lat'         => -38.9570,
                'lng'         => -68.0650,
                'summary'     => '[DEMO] Árbol caído sobre vereda',
                'description' => 'Zona de concentración moderada de reportes — demo heatmap amarillo.',
                'category'    => 'infraestructura',
                'priority'    => 'high',
                'address'     => 'Belgrano 400, Neuquén',
            ],
            [
                'lat'         => -38.9572,
                'lng'         => -68.0652,
                'summary'     => '[DEMO] Poste inclinado con riesgo de caída',
                'description' => 'Zona de concentración moderada de reportes — demo heatmap amarillo.',
                'category'    => 'alumbrado',
                'priority'    => 'high',
                'address'     => 'Belgrano 420, Neuquén',
            ],
            [
                'lat'         => -38.9568,
                'lng'         => -68.0648,
                'summary'     => '[DEMO] Zanjón sin señalización',
                'description' => 'Zona de concentración moderada de reportes — demo heatmap amarillo.',
                'category'    => 'infraestructura',
                'priority'    => 'medium',
                'address'     => 'Belgrano 380, Neuquén',
            ],
            [
                'lat'         => -38.9571,
                'lng'         => -68.0646,
                'summary'     => '[DEMO] Grafiti en pared municipal',
                'description' => 'Zona de concentración moderada de reportes — demo heatmap amarillo.',
                'category'    => 'vandalismo',
                'priority'    => 'low',
                'address'     => 'Belgrano y Salta, Neuquén',
            ],
        ];

        foreach ($zonaRoja as $data) {
            Report::create([...$data, 'user_id' => $user->id]);
        }
        $this->command->info('✓ Zona ROJA: 6 reportes creados (≥5 en 100 m → rojo).');

        foreach ($zonaAmarilla as $data) {
            Report::create([...$data, 'user_id' => $user->id]);
        }
        $this->command->info('✓ Zona AMARILLA: 4 reportes creados (3–4 en 100 m → amarillo).');
    }
}
