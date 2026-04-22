<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@snapit.com'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@snapit.com',
                'password' => Hash::make('admin1234'),
                'role'     => 'admin',
            ]
        );

        $this->command->info('Admin creado: admin@snapit.com / admin1234');
    }
}
