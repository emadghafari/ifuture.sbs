<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Product;
use App\Models\Setting;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function getSeo(Request $request)
    {
        $lang = $request->query('lang', 'en');

        $settings = Setting::whereIn('key', [
            'site_name',
            'seo_description',
            'seo_keywords',
            'seo_og_image',
            'seo_favicon',
        ])->get()->groupBy('key');

        $getSetting = function ($key, $locale) use ($settings) {
            if (!$settings->has($key))
                return '';
            $items = $settings->get($key);
            $localized = $items->firstWhere('locale', $locale);
            if ($localized)
                return $localized->value;
            $general = $items->firstWhere('locale', null);
            return $general ? $general->value : '';
        };

        return response()->json([
            'title' => $getSetting('site_name', null) ?: 'iFuture Hub',
            'description' => $getSetting('seo_description', $lang),
            'keywords' => $getSetting('seo_keywords', $lang),
            'og_image' => $getSetting('seo_og_image', null),
            'favicon' => $getSetting('seo_favicon', null),
        ]);
    }

    public function getHome(Request $request)
    {
        $lang = $request->query('lang', 'en'); // Changed default to en

        $settings = Setting::all()->groupBy('key');

        $getSetting = function ($key, $locale) use ($settings) {
            if (!$settings->has($key))
                return '';
            $items = $settings->get($key);
            // Try to find localized
            $localized = $items->firstWhere('locale', $locale);
            if ($localized)
                return $localized->value;
            // Fallback to null locale (general settings like logo)
            $general = $items->firstWhere('locale', null);
            return $general ? $general->value : '';
        };

        $site = [
            'name' => $getSetting('site_name', null),
            'logo' => $getSetting('site_logo', null),
            'email' => $getSetting('company_email', null),
            'phone' => $getSetting('company_phone', null),
            'address' => $getSetting('company_address', $lang),
            'copyright' => $getSetting('site_copyright', $lang),
            // New Footer Fields
            'footer_description' => $getSetting('footer_description', $lang),
            'footer_platforms_title' => $getSetting('footer_platforms_title', $lang),
            'footer_company_title' => $getSetting('footer_company_title', $lang),
            // Social Media
            'social_facebook' => $getSetting('social_facebook', null),
            'social_instagram' => $getSetting('social_instagram', null),
            'social_tiktok' => $getSetting('social_tiktok', null),
            'social_x' => $getSetting('social_x', null),
            'social_linkedin' => $getSetting('social_linkedin', null),
        ];

        $hero = [
            'title_1' => $getSetting('hero_title_1', $lang),
            'title_2' => $getSetting('hero_title_2', $lang),
            'subtitle' => $getSetting('hero_subtitle', $lang),
            'button' => $getSetting('hero_button', $lang),
            'stats' => [
                ['val' => $getSetting('stat_1_val', $lang), 'lbl' => $getSetting('stat_1_lbl', $lang)],
                ['val' => $getSetting('stat_2_val', $lang), 'lbl' => $getSetting('stat_2_lbl', $lang)],
                ['val' => $getSetting('stat_3_val', $lang), 'lbl' => $getSetting('stat_3_lbl', $lang)],
            ]
        ];

        $about = [
            'tagline' => $getSetting('about_tagline', $lang),
            'title_1' => $getSetting('about_title_1', $lang),
            'title_2' => $getSetting('about_title_2', $lang),
            'description' => $getSetting('about_description', $lang),
            'cta' => $getSetting('about_cta', $lang),
        ];

        $team_info = [
            'title' => $getSetting('team_title', $lang),
            'subtitle' => $getSetting('team_subtitle', $lang),
        ];

        $products = Product::where('status', true)
            ->with(['translations' => function ($query) use ($lang) {
            $query->where('locale', $lang);
        }])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($product) {
            $trans = $product->translations->first();
            return [
            'id' => $product->id,
            'slug' => $product->slug,
            'url' => $product->url,
            'image' => $product->image_path,
            'title' => $trans ? $trans->title : '',
            'description' => $trans ? $trans->description : '',
            ];
        });

        $team = TeamMember::with(['translations' => function ($query) use ($lang) {
            $query->where('locale', $lang);
        }])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($member) {
            $trans = $member->translations->first();
            return [
            'id' => $member->id,
            'type' => $member->type,
            'photo' => $member->photo_path,
            'name' => $trans ? $trans->name : '',
            'role' => $trans ? $trans->role : '',
            'bio' => $trans ? $trans->bio : '',
            'social' => [
            'facebook' => $member->facebook_url,
            'twitter' => $member->twitter_url,
            'linkedin' => $member->linkedin_url,
            ]
            ];
        });

        // Fetch top 3 active projects for the homepage
        $featured_projects = \App\Models\Project::where('status', '!=', 'draft')
            ->withCount('investments')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'site' => $site,
            'hero' => $hero,
            'about' => $about,
            'team_info' => $team_info,
            'products' => $products,
            'team' => $team,
            'featured_projects' => $featured_projects,
        ]);
    }

    public function getProjects(Request $request)
    {
        // Public endpoint to see all active/funding/completed projects
        $projects = \App\Models\Project::where('status', '!=', 'draft')
            ->withCount('investments')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($projects);
    }

    public function getProject($slug)
    {
        $project = \App\Models\Project::where('slug', $slug)
            ->where('status', '!=', 'draft')
            ->withCount('investments')
            ->with('stages')
            ->firstOrFail();

        return response()->json($project);
    }

    public function postContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'message' => 'required|string',
            'locale' => 'required|string|in:ar,he,en',
        ]);

        ContactMessage::create($validated);

        return response()->json(['message' => 'Message sent successfully.'], 201);
    }
}
