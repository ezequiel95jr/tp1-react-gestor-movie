<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class InteractionsSeeder extends Seeder
{
    public function run(): void
    {
        $reports = Report::all();
        $users   = User::where('role', 'user')->get();

        if ($reports->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No hay reportes o usuarios. Ejecutá primero ReportSeeder.');
            return;
        }

        $comments = [
            'Gracias por reportarlo, yo también lo noté hace días.',
            'Ya lo reporté antes y nunca vinieron a arreglarlo.',
            'Es una vergüenza que siga así hace tanto tiempo.',
            'Pasé por ahí esta mañana y confirmo que sigue igual.',
            'Espero que el municipio lo resuelva pronto.',
            'Me afecta todos los días cuando voy al trabajo.',
            'Hay que hacer más presión, esto no puede esperar.',
            'Lo mismo pasa en otras calles del barrio.',
            'Ojalá tomen esto con la seriedad que merece.',
            'Ya hablé con el vecino y dice que lleva semanas así.',
            'Parece que solo actúan cuando hay un accidente.',
            'Muy importante que quede registrado para reclamar.',
            'Apoyo este reporte, es un problema real.',
            'Mi vecina se quejó de lo mismo la semana pasada.',
            'Ojalá esto llegue a las autoridades correspondientes.',
        ];

        $likeCount    = 0;
        $commentCount = 0;

        foreach ($reports as $report) {
            // Likes: entre 1 y (cantidad de usuarios) usuarios distintos le dan like
            $likers = $users->shuffle()->take(rand(1, $users->count()));
            foreach ($likers as $user) {
                // El creador del reporte no se likea a sí mismo
                if ($user->id === $report->user_id) continue;

                Like::firstOrCreate([
                    'report_id' => $report->id,
                    'user_id'   => $user->id,
                ]);
                $likeCount++;
            }

            // Comentarios: entre 1 y 4 comentarios por reporte
            $commenters = $users->shuffle()->take(rand(1, min(4, $users->count())));
            foreach ($commenters as $user) {
                $text = $comments[array_rand($comments)];
                Comment::create([
                    'report_id' => $report->id,
                    'user_id'   => $user->id,
                    'content'   => $text,
                ]);
                $commentCount++;
            }
        }

        $this->command->info("✓ {$likeCount} likes y {$commentCount} comentarios creados.");
    }
}
