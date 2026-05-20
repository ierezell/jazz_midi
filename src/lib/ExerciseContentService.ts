/**
 * ExerciseContentService
 *
 * Single source of truth for all exercise/song content.
 * Fetches metadata from the content_catalog Supabase table and resolves
 * MusicXML file URLs from Supabase Storage (with static/ fallback).
 *
 * Usage:
 *   const catalog = await exerciseContentService.getLicks();
 *   const url     = exerciseContentService.getMusicXmlUrl(item.storage_path);
 */

import { supabase } from './supabaseClient';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ContentCategory = 'lick' | 'song' | 'rhythm' | 'hand_independence';
export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ContentTier = 'free' | 'basic' | 'premium';

export interface ContentItem {
    id: string;
    name: string;
    description: string;
    category: ContentCategory;
    subcategory: string | null;
    difficulty: ContentDifficulty | null;
    tier: ContentTier;
    /** Path inside the 'exercise-content' Storage bucket */
    storage_path: string;
    /** Fallback URL served from static/ */
    static_url: string | null;
    /** Category-specific metadata (bpm, key, composer, tags, chords, …) */
    metadata: Record<string, unknown>;
    sort_order: number;
}

export interface CatalogFilter {
    category?: ContentCategory;
    difficulty?: ContentDifficulty;
    tier?: ContentTier;
    subcategory?: string;
    /** Free-text search against name + description */
    search?: string;
}

// ── Service ───────────────────────────────────────────────────────────────────

class ExerciseContentService {
    /** In-memory cache — cleared on sign-out */
    private cache = new Map<string, ContentItem[]>();

    // ── Public URL resolution ──────────────────────────────────────────────

    /**
     * Returns the public Supabase Storage URL for a given storage path.
     * Falls back to the static/ URL if Storage is unavailable.
     */
    getMusicXmlUrl(item: ContentItem): string {
        const { data } = supabase.storage
            .from('exercise-content')
            .getPublicUrl(item.storage_path);

        return data.publicUrl ?? item.static_url ?? `/${item.storage_path}`;
    }

    // ── Catalog queries ────────────────────────────────────────────────────

    async getCatalog(filter: CatalogFilter = {}): Promise<ContentItem[]> {
        const cacheKey = JSON.stringify(filter);
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        let query = supabase
            .from('content_catalog')
            .select('*')
            .order('sort_order', { ascending: true });

        if (filter.category) query = query.eq('category', filter.category);
        if (filter.difficulty) query = query.eq('difficulty', filter.difficulty);
        if (filter.tier) query = query.eq('tier', filter.tier);
        if (filter.subcategory) query = query.eq('subcategory', filter.subcategory);
        if (filter.search) {
            query = query.textSearch(
                'fts',
                filter.search,
                { config: 'english', type: 'websearch' }
            );
        }

        const { data, error } = await query;
        if (error) {
            console.error('[ExerciseContentService] getCatalog error:', error.message);
            return [];
        }

        const items = (data ?? []) as ContentItem[];
        this.cache.set(cacheKey, items);
        return items;
    }

    async getLicks(filter: Omit<CatalogFilter, 'category'> = {}): Promise<ContentItem[]> {
        return this.getCatalog({ ...filter, category: 'lick' });
    }

    async getSongs(filter: Omit<CatalogFilter, 'category'> = {}): Promise<ContentItem[]> {
        return this.getCatalog({ ...filter, category: 'song' });
    }

    async getRhythmPatterns(filter: Omit<CatalogFilter, 'category'> = {}): Promise<ContentItem[]> {
        return this.getCatalog({ ...filter, category: 'rhythm' });
    }

    async getHandIndependenceExercises(
        filter: Omit<CatalogFilter, 'category'> = {}
    ): Promise<ContentItem[]> {
        return this.getCatalog({ ...filter, category: 'hand_independence' });
    }

    async getById(id: string): Promise<ContentItem | null> {
        const { data, error } = await supabase
            .from('content_catalog')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[ExerciseContentService] getById error:', error.message);
            return null;
        }
        return data as ContentItem;
    }

    /**
     * Fetch and return the raw MusicXML string for an item.
     * Tries Supabase Storage first, falls back to static/.
     */
    async fetchMusicXml(item: ContentItem): Promise<string | null> {
        const url = this.getMusicXmlUrl(item);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.text();
        } catch (err) {
            // Fallback to static/
            if (item.static_url && item.static_url !== url) {
                try {
                    const res = await fetch(item.static_url);
                    if (res.ok) return res.text();
                } catch {
                    // ignore
                }
            }
            console.error('[ExerciseContentService] fetchMusicXml failed for', item.id, err);
            return null;
        }
    }

    /** Clear cache (call on sign-out or locale change) */
    clearCache(): void {
        this.cache.clear();
    }
}

export const exerciseContentService = new ExerciseContentService();
