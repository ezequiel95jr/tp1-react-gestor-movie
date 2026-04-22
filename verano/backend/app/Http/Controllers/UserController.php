<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function me()
    {
        $user = auth()->user();

        return response()->json([
            'id'            => $user->id,
            'name'          => $user->name,
            'email'         => $user->email,
            'role'          => $user->role,
            'avatar_url'    => $user->avatar
                                ? url('storage/' . $user->avatar)
                                : null,
            'created_at'    => $user->created_at,
            'reports_count' => $user->reports()->count(),
            'likes_count'   => $user->likes()->count(),
        ]);
    }

    public function updateMe(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name'                  => 'sometimes|string|max:255',
            'email'                 => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password'              => 'sometimes|nullable|min:8|confirmed',
            'password_confirmation' => 'sometimes|nullable',
        ]);

        if (array_key_exists('password', $validated)) {
            if ($validated['password']) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }
        }

        unset($validated['password_confirmation']);
        $user->update($validated);

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]);
    }

    public function myReports()
    {
        $user = auth()->user();

        $reports = $user->reports()
            ->latest()
            ->get(['id', 'summary', 'description', 'category', 'priority', 'address', 'likes_count', 'comments_count', 'created_at']);

        return response()->json($reports);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = auth()->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'avatar_url' => url('storage/' . $path),
        ]);
    }
}
