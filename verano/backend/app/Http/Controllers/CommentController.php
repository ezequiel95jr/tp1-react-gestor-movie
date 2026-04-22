<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request, $reportId)
{
    $data = $request->validate([
        'content' => 'required|string'
    ]);

    $comment = Comment::create([
        'report_id' => $reportId,
        'user_id' => auth()->id(),
        'content' => $data['content']
    ]);

    return response()->json($comment, 201);
}

}
