<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends Controller
{
    public function toggle(Request $request, $reportId)
{
    $like = Like::where('report_id', $reportId)
        ->where('user_id', auth()->id())
        ->first();

    if ($like) {
        $like->delete();
        return response()->json(['liked' => false]);
    }

    Like::create([
        'report_id' => $reportId,
        'user_id' => auth()->id()
    ]);

    return response()->json(['liked' => true]);
}
    public function store($id)
    {
        return response()->json([
            'bearer_token' => request()->bearerToken(),
            'auth_check' => auth()->check(),
            'user' => auth()->user(),
        ]);
    }

}
