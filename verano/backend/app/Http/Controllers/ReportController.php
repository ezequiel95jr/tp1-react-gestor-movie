<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Listar todos los reportes
     */
    public function index()
    {
        return Report::with(['user', 'images'])
            ->latest()
            ->paginate(5);
    }
    public function all()
    {
        return response()->json(
            Report::with(['user', 'images'])->latest()->get()
        );
    }

    /**
     * Mostrar un reporte específico
     */
public function show($id)
{
    $report = Report::with([
        'user',
        'comments.user',
        'images',
    ])->findOrFail($id);

    return response()->json([
        ...$report->toArray(),
        'liked_by_user' => auth()->check()
            ? $report->likes()
                ->where('user_id', auth()->id())
                ->exists()
            : false,
    ]);
}

    /**
     * Crear un nuevo reporte
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'summary' => 'required|string',
            'description' => 'required|string',
            'category' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $data['user_id'] = $request->user()->id;

        $report = Report::create($data);

        return response()->json($report, 201);
    }
    private function getAddressFromCoordinates($lat, $lng)
    {
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'User-Agent' => 'MapReportsApp/1.0'
            ])->get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'json',
                'lat'    => $lat,
                'lon'    => $lng,
            ]);

            $addressData = $response->json('address');

            if (!$addressData) return null;

            $street =
                $addressData['road']
                ?? $addressData['pedestrian']
                ?? $addressData['residential']
                ?? '';

            $number = $addressData['house_number'] ?? '';

            $city =
                $addressData['city']
                ?? $addressData['town']
                ?? $addressData['village']
                ?? '';

            return trim("$street $number, $city") ?: null;

        } catch (\Exception $e) {
            return null;
        }
    }


    /**
     * Actualizar un reporte
     */
    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $data = $request->validate([
            'summary'     => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category'    => 'nullable|string|max:255',
            'priority'    => 'sometimes|in:low,medium,high',
            'lat'         => 'sometimes|numeric',
            'lng'         => 'sometimes|numeric',
        ]);

        if (isset($data['lat']) && isset($data['lng'])) {

            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'MapReportsApp/1.0'
                ])->get('https://nominatim.openstreetmap.org/reverse', [
                    'format' => 'json',
                    'lat'    => $data['lat'],
                    'lon'    => $data['lng'],
                ]);

                $addressData = $response->json('address');

                if ($addressData) {
                    $street = $addressData['road'] ?? '';
                    $number = $addressData['house_number'] ?? '';
                    $city   = $addressData['city']
                        ?? $addressData['town']
                        ?? $addressData['village']
                        ?? '';

                    $formattedAddress = trim("$street $number, $city");

                    $data['address'] = $formattedAddress ?: null;
                }

            } catch (\Exception $e) {
            }
        }

        $report->update($data);

        return response()->json($report);
    }


    /**
     * Eliminar un reporte
     */
    public function destroy($id)
    {
        $report = Report::findOrFail($id);

        $report->delete();

        return response()->json([
            'message' => 'Reporte eliminado correctamente'
        ]);
    }
}
