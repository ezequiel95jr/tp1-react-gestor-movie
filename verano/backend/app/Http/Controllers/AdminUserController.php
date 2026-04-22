<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminUserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::withCount(['reports', 'likes'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($u) => [
                    'id'            => $u->id,
                    'name'          => $u->name,
                    'email'         => $u->email,
                    'role'          => $u->role,
                    'avatar_url'    => $u->avatar ? url('storage/' . $u->avatar) : null,
                    'reports_count' => $u->reports_count,
                    'likes_count'   => $u->likes_count,
                    'created_at'    => $u->created_at,
                ])
        );
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role'  => 'sometimes|in:user,admin',
        ]);

        $user->update($data);

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'No podés eliminarte a vos mismo'], 422);
        }

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
