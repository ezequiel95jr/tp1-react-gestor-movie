<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Models\Comment;
use App\Models\Like;

class Report extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'description',
        'lat',
        'lng',
        'category',
        'subtype',
        'tags',
        'priority',
        'summary',
        'ai_confidence',
        'ai_needs_review',
        'address',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'ai_needs_review' => 'boolean',
    ];

    public function images()
    {
        return $this->hasMany(ReportImage::class);
    }

    public function votes()
    {
        return $this->hasMany(ReportVote::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function likes()
    {
    return $this->hasMany(Like::class);
    }
}