<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = [
        'report_id',
        'user_id',
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
    static::created(function ($like) {
        $like->report()->increment('likes_count');
    });

    static::deleted(function ($like) {
        $report = $like->report;
        if ($report->likes_count > 0) {
            $report->decrement('likes_count');
        }
    });
}
}
