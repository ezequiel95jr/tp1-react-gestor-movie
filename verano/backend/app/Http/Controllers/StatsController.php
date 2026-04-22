<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function reportsByMonth()
    {
        $rows = DB::table('reports')
            ->selectRaw("TO_CHAR(created_at, 'YYYY-MM') as period, COUNT(*) as total")
            ->groupByRaw("TO_CHAR(created_at, 'YYYY-MM')")
            ->orderBy('period')
            ->get();

        return response()->json($rows);
    }

    public function reportsByWeek()
    {
        $rows = DB::table('reports')
            ->selectRaw("TO_CHAR(created_at, 'IYYY-IW') as period, COUNT(*) as total")
            ->groupByRaw("TO_CHAR(created_at, 'IYYY-IW')")
            ->orderBy('period')
            ->get();

        return response()->json($rows);
    }
}
