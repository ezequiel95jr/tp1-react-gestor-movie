<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportImage extends Model
{
    protected $fillable = ['report_id', 'url'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): string
    {
        return url('storage/' . $this->url);
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}

