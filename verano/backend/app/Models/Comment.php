<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'report_id',
        'user_id',
        'content'
    ];

    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    protected static function booted()
{
    static::created(function ($comment) {
        $comment->report()->increment('comments_count');
    });

    static::deleted(function ($comment) {
        $comment->report()->decrement('comments_count');
    });
}
}