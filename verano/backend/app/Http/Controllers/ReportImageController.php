<?php

namespace App\Http\Controllers;

use App\Models\ReportImage;
use Illuminate\Http\Request;

class ReportImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $reportId)
    {
        $request->validate([
            'image' => 'required|image|max:4096',
        ]);

        $path = $request->file('image')->store('report-images', 'public');

        $image = ReportImage::create([
            'report_id' => $reportId,
            'url'       => $path,
        ]);

        return response()->json([
            'id'        => $image->id,
            'image_url' => $image->image_url,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReportImage $reportImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReportImage $reportImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReportImage $reportImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReportImage $reportImage)
    {
        //
    }
}
