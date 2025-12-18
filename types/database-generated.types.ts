export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      amenities111: {
        Row: {
          city_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          key: string | null;
          label: string | null;
          price_example: string | null;
          vehicle_type: string | null;
        };
        Insert: {
          city_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string | null;
          label?: string | null;
          price_example?: string | null;
          vehicle_type?: string | null;
        };
        Update: {
          city_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string | null;
          label?: string | null;
          price_example?: string | null;
          vehicle_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "amenities111_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities111";
            referencedColumns: ["id"];
          },
        ];
      };
      b2r_poll_options: {
        Row: {
          display_order: number;
          id: string;
          option_text: string;
          poll_id: string | null;
        };
        Insert: {
          display_order: number;
          id: string;
          option_text: string;
          poll_id?: string | null;
        };
        Update: {
          display_order?: number;
          id?: string;
          option_text?: string;
          poll_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "b2r_poll_options_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "b2r_poll_results";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "b2r_poll_options_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "b2r_polls";
            referencedColumns: ["id"];
          },
        ];
      };
      b2r_poll_votes: {
        Row: {
          id: number;
          option_id: string | null;
          poll_id: string | null;
          voted_at: string;
        };
        Insert: {
          id?: number;
          option_id?: string | null;
          poll_id?: string | null;
          voted_at?: string;
        };
        Update: {
          id?: number;
          option_id?: string | null;
          poll_id?: string | null;
          voted_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "b2r_poll_votes_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "b2r_poll_options";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "b2r_poll_votes_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "b2r_poll_results";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "b2r_poll_votes_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "b2r_poll_results";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "b2r_poll_votes_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "b2r_polls";
            referencedColumns: ["id"];
          },
        ];
      };
      b2r_polls: {
        Row: {
          category: string;
          created_at: string;
          group_key: string;
          id: string;
          is_active: boolean | null;
          question: string;
          tags: string[] | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          group_key: string;
          id: string;
          is_active?: boolean | null;
          question: string;
          tags?: string[] | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          group_key?: string;
          id?: string;
          is_active?: boolean | null;
          question?: string;
          tags?: string[] | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author: string | null;
          content: string | null;
          created_at: string | null;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          slug: string;
          tags: string[] | null;
          thumbnail_url: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          author?: string | null;
          content?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          slug: string;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          author?: string | null;
          content?: string | null;
          created_at?: string | null;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          slug?: string;
          tags?: string[] | null;
          thumbnail_url?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      categories_allowlist: {
        Row: {
          name: string | null;
          parent_slug: string | null;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          name?: string | null;
          parent_slug?: string | null;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          name?: string | null;
          parent_slug?: string | null;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      categories1: {
        Row: {
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      categories1_csv: {
        Row: {
          name: string;
          parent_slug: string | null;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          name: string;
          parent_slug?: string | null;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          name?: string;
          parent_slug?: string | null;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      categories1_csv_backup: {
        Row: {
          backup_at: string | null;
          name: string;
          parent_slug: string | null;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          backup_at?: string | null;
          name: string;
          parent_slug?: string | null;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          backup_at?: string | null;
          name?: string;
          parent_slug?: string | null;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          slug: string;
          state_id: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          slug: string;
          state_id: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          slug?: string;
          state_id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey";
            columns: ["state_id"];
            isOneToOne: false;
            referencedRelation: "states";
            referencedColumns: ["id"];
          },
        ];
      };
      cities111: {
        Row: {
          created_at: string | null;
          hero_h1: string | null;
          hero_subheading: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          slug: string;
          state: string | null;
        };
        Insert: {
          created_at?: string | null;
          hero_h1?: string | null;
          hero_subheading?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          slug: string;
          state?: string | null;
        };
        Update: {
          created_at?: string | null;
          hero_h1?: string | null;
          hero_subheading?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          slug?: string;
          state?: string | null;
        };
        Relationships: [];
      };
      content_blocks: {
        Row: {
          id: string;
          props: Json;
          publish_at: string | null;
          slug: string;
          status: string | null;
          type: Database["public"]["Enums"]["block_type"];
          unpublish_at: string | null;
          updated_at: string | null;
          variant: string | null;
        };
        Insert: {
          id?: string;
          props?: Json;
          publish_at?: string | null;
          slug: string;
          status?: string | null;
          type: Database["public"]["Enums"]["block_type"];
          unpublish_at?: string | null;
          updated_at?: string | null;
          variant?: string | null;
        };
        Update: {
          id?: string;
          props?: Json;
          publish_at?: string | null;
          slug?: string;
          status?: string | null;
          type?: Database["public"]["Enums"]["block_type"];
          unpublish_at?: string | null;
          updated_at?: string | null;
          variant?: string | null;
        };
        Relationships: [];
      };
      content_blocks111: {
        Row: {
          block_key: string | null;
          body: string | null;
          city_id: string | null;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          position: number | null;
          title: string | null;
          vehicle_type: string | null;
        };
        Insert: {
          block_key?: string | null;
          body?: string | null;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          position?: number | null;
          title?: string | null;
          vehicle_type?: string | null;
        };
        Update: {
          block_key?: string | null;
          body?: string | null;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          position?: number | null;
          title?: string | null;
          vehicle_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "content_blocks111_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities111";
            referencedColumns: ["id"];
          },
        ];
      };
      content_points: {
        Row: {
          body: Json | null;
          created_at: string | null;
          id: string;
          key: string | null;
          metadata: Json | null;
          page_slug: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          body?: Json | null;
          created_at?: string | null;
          id?: string;
          key?: string | null;
          metadata?: Json | null;
          page_slug?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          body?: Json | null;
          created_at?: string | null;
          id?: string;
          key?: string | null;
          metadata?: Json | null;
          page_slug?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      content_sections: {
        Row: {
          content: string | null;
          created_at: string;
          features: Json | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          features?: Json | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          features?: Json | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      design_tokens: {
        Row: {
          description: string | null;
          id: string;
          kind: Database["public"]["Enums"]["token_kind"];
          name: string;
          scope: Database["public"]["Enums"]["token_scope"];
          theme_id: string | null;
          updated_at: string | null;
          value: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          kind: Database["public"]["Enums"]["token_kind"];
          name: string;
          scope?: Database["public"]["Enums"]["token_scope"];
          theme_id?: string | null;
          updated_at?: string | null;
          value: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          kind?: Database["public"]["Enums"]["token_kind"];
          name?: string;
          scope?: Database["public"]["Enums"]["token_scope"];
          theme_id?: string | null;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          category: string | null;
          created_at: string;
          date_range: string | null;
          description: string;
          id: string;
          images: string[] | null;
          page_content: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          date_range?: string | null;
          description: string;
          id?: string;
          images?: string[] | null;
          page_content?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          date_range?: string | null;
          description?: string;
          id?: string;
          images?: string[] | null;
          page_content?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          click_count: number;
          created_at: string;
          id: string;
          page_slug: string;
          question: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          answer: string;
          click_count?: number;
          created_at?: string;
          id?: string;
          page_slug: string;
          question: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          click_count?: number;
          created_at?: string;
          id?: string;
          page_slug?: string;
          question?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      fleet_category_amenities: {
        Row: {
          amenities: string[];
          category: string;
        };
        Insert: {
          amenities?: string[];
          category: string;
        };
        Update: {
          amenities?: string[];
          category?: string;
        };
        Relationships: [];
      };
      headers: {
        Row: {
          background_url: string | null;
          created_at: string;
          email: string | null;
          gradient_from: string | null;
          gradient_to: string | null;
          gradient_via: string | null;
          id: string;
          is_active: boolean;
          page_slug: string;
          phone_display: string | null;
          phone_tel: string | null;
          primary_cta: Json | null;
          secondary_cta: Json | null;
          subtitle: string | null;
          tertiary_cta: Json | null;
          text_color: string | null;
          title: string | null;
          updated_at: string;
          wave_fill: string | null;
        };
        Insert: {
          background_url?: string | null;
          created_at?: string;
          email?: string | null;
          gradient_from?: string | null;
          gradient_to?: string | null;
          gradient_via?: string | null;
          id?: string;
          is_active?: boolean;
          page_slug: string;
          phone_display?: string | null;
          phone_tel?: string | null;
          primary_cta?: Json | null;
          secondary_cta?: Json | null;
          subtitle?: string | null;
          tertiary_cta?: Json | null;
          text_color?: string | null;
          title?: string | null;
          updated_at?: string;
          wave_fill?: string | null;
        };
        Update: {
          background_url?: string | null;
          created_at?: string;
          email?: string | null;
          gradient_from?: string | null;
          gradient_to?: string | null;
          gradient_via?: string | null;
          id?: string;
          is_active?: boolean;
          page_slug?: string;
          phone_display?: string | null;
          phone_tel?: string | null;
          primary_cta?: Json | null;
          secondary_cta?: Json | null;
          subtitle?: string | null;
          tertiary_cta?: Json | null;
          text_color?: string | null;
          title?: string | null;
          updated_at?: string;
          wave_fill?: string | null;
        };
        Relationships: [];
      };
      heroes1: {
        Row: {
          city_id: string | null;
          data: Json;
          id: string;
          is_active: boolean;
          page_slug: string;
          style: Json | null;
          updated_at: string;
          variant: string | null;
          vehicle_type: string | null;
        };
        Insert: {
          city_id?: string | null;
          data: Json;
          id?: string;
          is_active?: boolean;
          page_slug: string;
          style?: Json | null;
          updated_at?: string;
          variant?: string | null;
          vehicle_type?: string | null;
        };
        Update: {
          city_id?: string | null;
          data?: Json;
          id?: string;
          is_active?: boolean;
          page_slug?: string;
          style?: Json | null;
          updated_at?: string;
          variant?: string | null;
          vehicle_type?: string | null;
        };
        Relationships: [];
      };
      heroes1_archive: {
        Row: {
          archived_at: string | null;
          city_id: string | null;
          data: Json;
          id: string;
          is_active: boolean;
          page_slug: string;
          updated_at: string;
          vehicle_type: string | null;
        };
        Insert: {
          archived_at?: string | null;
          city_id?: string | null;
          data: Json;
          id?: string;
          is_active?: boolean;
          page_slug: string;
          updated_at?: string;
          vehicle_type?: string | null;
        };
        Update: {
          archived_at?: string | null;
          city_id?: string | null;
          data?: Json;
          id?: string;
          is_active?: boolean;
          page_slug?: string;
          updated_at?: string;
          vehicle_type?: string | null;
        };
        Relationships: [];
      };
      homepage_hero: {
        Row: {
          autoplay_ms: number;
          created_at: string;
          ctas: Json;
          darken: number;
          id: string;
          image_keys: string[] | null;
          slug: string;
          storage_bucket: string;
          subtitle: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          autoplay_ms?: number;
          created_at?: string;
          ctas?: Json;
          darken?: number;
          id?: string;
          image_keys?: string[] | null;
          slug?: string;
          storage_bucket?: string;
          subtitle?: string;
          title?: string;
          updated_at?: string;
        };
        Update: {
          autoplay_ms?: number;
          created_at?: string;
          ctas?: Json;
          darken?: number;
          id?: string;
          image_keys?: string[] | null;
          slug?: string;
          storage_bucket?: string;
          subtitle?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      images111: {
        Row: {
          alt_text: string | null;
          city_id: string | null;
          created_at: string | null;
          id: string;
          storage_path: string | null;
          vehicle_type: string | null;
        };
        Insert: {
          alt_text?: string | null;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          storage_path?: string | null;
          vehicle_type?: string | null;
        };
        Update: {
          alt_text?: string | null;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          storage_path?: string | null;
          vehicle_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "images111_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities111";
            referencedColumns: ["id"];
          },
        ];
      };
      locations: {
        Row: {
          available_fleet_types: string[] | null;
          city_name: string;
          city_slug: string;
          coordinates: Json;
          created_at: string | null;
          id: string;
          local_events: Json | null;
          name: string;
          neighborhood_vibes: Json | null;
          seasonal_guide: Json | null;
          state_name: string;
          state_slug: string;
          trivia: Json | null;
        };
        Insert: {
          available_fleet_types?: string[] | null;
          city_name: string;
          city_slug: string;
          coordinates: Json;
          created_at?: string | null;
          id?: string;
          local_events?: Json | null;
          name: string;
          neighborhood_vibes?: Json | null;
          seasonal_guide?: Json | null;
          state_name: string;
          state_slug: string;
          trivia?: Json | null;
        };
        Update: {
          available_fleet_types?: string[] | null;
          city_name?: string;
          city_slug?: string;
          coordinates?: Json;
          created_at?: string | null;
          id?: string;
          local_events?: Json | null;
          name?: string;
          neighborhood_vibes?: Json | null;
          seasonal_guide?: Json | null;
          state_name?: string;
          state_slug?: string;
          trivia?: Json | null;
        };
        Relationships: [];
      };
      longform111: {
        Row: {
          city_id: string | null;
          created_at: string | null;
          html_body: string | null;
          id: string;
          metadata: Json | null;
          position: number | null;
          slug: string | null;
          title: string | null;
          vehicle_type: string | null;
        };
        Insert: {
          city_id?: string | null;
          created_at?: string | null;
          html_body?: string | null;
          id?: string;
          metadata?: Json | null;
          position?: number | null;
          slug?: string | null;
          title?: string | null;
          vehicle_type?: string | null;
        };
        Update: {
          city_id?: string | null;
          created_at?: string | null;
          html_body?: string | null;
          id?: string;
          metadata?: Json | null;
          position?: number | null;
          slug?: string | null;
          title?: string | null;
          vehicle_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "longform111_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities111";
            referencedColumns: ["id"];
          },
        ];
      };
      page_sections: {
        Row: {
          data: Json;
          id: string;
          is_active: boolean;
          kind: string;
          page_slug: string;
          position: number;
          updated_at: string;
        };
        Insert: {
          data?: Json;
          id?: string;
          is_active?: boolean;
          kind?: string;
          page_slug?: string;
          position?: number;
          updated_at?: string;
        };
        Update: {
          data?: Json;
          id?: string;
          is_active?: boolean;
          kind?: string;
          page_slug?: string;
          position?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pages: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          route: string;
          theme_key: string | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          route: string;
          theme_key?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          route?: string;
          theme_key?: string | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pages_theme_key_fkey";
            columns: ["theme_key"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["key"];
          },
        ];
      };
      poll_categories1: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          parent_slug: string | null;
          slug: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          parent_slug?: string | null;
          slug: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          parent_slug?: string | null;
          slug?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_categories1_parent_fk";
            columns: ["parent_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      poll_options: {
        Row: {
          option_id: string;
          poll_id: string;
        };
        Insert: {
          option_id: string;
          poll_id: string;
        };
        Update: {
          option_id?: string;
          poll_id?: string;
        };
        Relationships: [];
      };
      poll_options_new: {
        Row: {
          id: string;
          option_text: string;
          poll_id: string | null;
          vote_count: number | null;
        };
        Insert: {
          id?: string;
          option_text: string;
          poll_id?: string | null;
          vote_count?: number | null;
        };
        Update: {
          id?: string;
          option_text?: string;
          poll_id?: string | null;
          vote_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_options_new_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls_new";
            referencedColumns: ["id"];
          },
        ];
      };
      poll_options1: {
        Row: {
          id: string;
          label: string;
          ord: number;
          poll_id: string;
          slug: string;
          sort_order: number | null;
          value: string | null;
          vote_count: number;
        };
        Insert: {
          id?: string;
          label: string;
          ord?: number;
          poll_id: string;
          slug: string;
          sort_order?: number | null;
          value?: string | null;
          vote_count?: number;
        };
        Update: {
          id?: string;
          label?: string;
          ord?: number;
          poll_id?: string;
          slug?: string;
          sort_order?: number | null;
          value?: string | null;
          vote_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      poll_tag_links: {
        Row: {
          poll_id: string;
          tag_slug: string;
        };
        Insert: {
          poll_id: string;
          tag_slug: string;
        };
        Update: {
          poll_id?: string;
          tag_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_tag_slug_fkey";
            columns: ["tag_slug"];
            isOneToOne: false;
            referencedRelation: "poll_tags1";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "poll_tag_links_tag_slug_fkey";
            columns: ["tag_slug"];
            isOneToOne: false;
            referencedRelation: "v_poll_tags";
            referencedColumns: ["slug"];
          },
        ];
      };
      poll_tags1: {
        Row: {
          name: string;
          parent_slug: string | null;
          slug: string;
          sort_order: number;
        };
        Insert: {
          name: string;
          parent_slug?: string | null;
          slug: string;
          sort_order: number;
        };
        Update: {
          name?: string;
          parent_slug?: string | null;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      poll_votes: {
        Row: {
          count: number | null;
          option_id: string;
          poll_id: string;
        };
        Insert: {
          count?: number | null;
          option_id: string;
          poll_id: string;
        };
        Update: {
          count?: number | null;
          option_id?: string;
          poll_id?: string;
        };
        Relationships: [];
      };
      poll_votes_new: {
        Row: {
          created_at: string | null;
          id: string;
          option_id: string | null;
          poll_id: string | null;
          user_identifier: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          option_id?: string | null;
          poll_id?: string | null;
          user_identifier?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          option_id?: string | null;
          poll_id?: string | null;
          user_identifier?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_votes_new_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_options_new";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes_new_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls_new";
            referencedColumns: ["id"];
          },
        ];
      };
      poll_votes1: {
        Row: {
          created_at: string;
          id: string;
          is_moderated: boolean | null;
          option_id: string;
          poll_id: string;
          voter_key: string;
          voter_token: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_moderated?: boolean | null;
          option_id: string;
          poll_id: string;
          voter_key: string;
          voter_token?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_moderated?: boolean | null;
          option_id?: string;
          poll_id?: string;
          voter_key?: string;
          voter_token?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_option_counts";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_options1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_options_public";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_poll_options_label";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      polls: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          options: Json[];
          question: string;
          votes: Json;
        };
        Insert: {
          category: string;
          created_at?: string;
          id: string;
          options: Json[];
          question: string;
          votes: Json;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          options?: Json[];
          question?: string;
          votes?: Json;
        };
        Relationships: [];
      };
      polls_new: {
        Row: {
          category: string | null;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          is_active: boolean | null;
          question: string;
          slug: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          question: string;
          slug: string;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          question?: string;
          slug?: string;
        };
        Relationships: [];
      };
      polls1: {
        Row: {
          category_slug: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          main_category: string | null;
          meta: Json | null;
          meta_json: Json;
          multi_select: boolean | null;
          question: string;
          show_on_city_page: boolean | null;
          show_on_home: boolean | null;
          show_on_polls: boolean | null;
          show_on_vehicle_page: boolean | null;
          slug: string;
        };
        Insert: {
          category_slug?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          main_category?: string | null;
          meta?: Json | null;
          meta_json?: Json;
          multi_select?: boolean | null;
          question: string;
          show_on_city_page?: boolean | null;
          show_on_home?: boolean | null;
          show_on_polls?: boolean | null;
          show_on_vehicle_page?: boolean | null;
          slug: string;
        };
        Update: {
          category_slug?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          main_category?: string | null;
          meta?: Json | null;
          meta_json?: Json;
          multi_select?: boolean | null;
          question?: string;
          show_on_city_page?: boolean | null;
          show_on_home?: boolean | null;
          show_on_polls?: boolean | null;
          show_on_vehicle_page?: boolean | null;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      polls1_backup: {
        Row: {
          backup_at: string | null;
          category_slug: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          meta: Json | null;
          meta_json: Json;
          multi_select: boolean | null;
          question: string;
          slug: string;
        };
        Insert: {
          backup_at?: string | null;
          category_slug?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta?: Json | null;
          meta_json?: Json;
          multi_select?: boolean | null;
          question: string;
          slug: string;
        };
        Update: {
          backup_at?: string | null;
          category_slug?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          meta?: Json | null;
          meta_json?: Json;
          multi_select?: boolean | null;
          question?: string;
          slug?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          author_display: string;
          body: string;
          city_slug: string | null;
          created_at: string;
          event_slug: string | null;
          id: string;
          published_at: string | null;
          rating: number | null;
          service_date: string | null;
          slug: string;
          source: string;
          source_id: string | null;
          source_url: string | null;
          state_slug: string | null;
          tags: string[] | null;
        };
        Insert: {
          author_display: string;
          body: string;
          city_slug?: string | null;
          created_at?: string;
          event_slug?: string | null;
          id?: string;
          published_at?: string | null;
          rating?: number | null;
          service_date?: string | null;
          slug: string;
          source?: string;
          source_id?: string | null;
          source_url?: string | null;
          state_slug?: string | null;
          tags?: string[] | null;
        };
        Update: {
          author_display?: string;
          body?: string;
          city_slug?: string | null;
          created_at?: string;
          event_slug?: string | null;
          id?: string;
          published_at?: string | null;
          rating?: number | null;
          service_date?: string | null;
          slug?: string;
          source?: string;
          source_id?: string | null;
          source_url?: string | null;
          state_slug?: string | null;
          tags?: string[] | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      sites: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      states: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      style_tokens: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          page_slug: string;
          site_slug: string;
          tokens: Json;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name?: string;
          page_slug?: string;
          site_slug: string;
          tokens: Json;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          page_slug?: string;
          site_slug?: string;
          tokens?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: number;
          name: string;
          slug: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          id: string;
          is_default: boolean | null;
          key: string;
          label: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          is_default?: boolean | null;
          key: string;
          label: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          is_default?: boolean | null;
          key?: string;
          label?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      tool_code: {
        Row: {
          code: string;
          created_at: string;
          handler: string;
          inputs_schema: Json;
          is_active: boolean;
          runtime: string;
          tool_id: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          handler?: string;
          inputs_schema?: Json;
          is_active?: boolean;
          runtime?: string;
          tool_id: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          handler?: string;
          inputs_schema?: Json;
          is_active?: boolean;
          runtime?: string;
          tool_id?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "tool_code_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_placements: {
        Row: {
          created_at: string;
          id: string;
          is_enabled: boolean;
          page_slug: string;
          section_key: string;
          sort_order: number;
          tool_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          page_slug: string;
          section_key?: string;
          sort_order?: number;
          tool_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_enabled?: boolean;
          page_slug?: string;
          section_key?: string;
          sort_order?: number;
          tool_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_placements_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      tool_runs: {
        Row: {
          code_version: number;
          created_at: string;
          duration_ms: number | null;
          error: string | null;
          id: string;
          input: Json;
          ok: boolean;
          output: Json | null;
          runtime: string;
          tool_id: string;
        };
        Insert: {
          code_version: number;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          id?: string;
          input: Json;
          ok: boolean;
          output?: Json | null;
          runtime?: string;
          tool_id: string;
        };
        Update: {
          code_version?: number;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          id?: string;
          input?: Json;
          ok?: boolean;
          output?: Json | null;
          runtime?: string;
          tool_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tool_runs_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      tools: {
        Row: {
          category: string;
          created_at: string;
          cta_link: string | null;
          cta_text: string | null;
          description: string;
          href: string;
          icon_name: string | null;
          id: string;
          modal_content: string | null;
          slug: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          description: string;
          href: string;
          icon_name?: string | null;
          id: string;
          modal_content?: string | null;
          slug?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          description?: string;
          href?: string;
          icon_name?: string | null;
          id?: string;
          modal_content?: string | null;
          slug?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicle_categories: {
        Row: {
          key: string;
          label: string;
        };
        Insert: {
          key: string;
          label: string;
        };
        Update: {
          key?: string;
          label?: string;
        };
        Relationships: [];
      };
      vehicle_images11: {
        Row: {
          bucket: string;
          created_at: string | null;
          id: string;
          image_type: string;
          object_key: string;
          vehicle_id: string;
        };
        Insert: {
          bucket?: string;
          created_at?: string | null;
          id?: string;
          image_type: string;
          object_key: string;
          vehicle_id: string;
        };
        Update: {
          bucket?: string;
          created_at?: string | null;
          id?: string;
          image_type?: string;
          object_key?: string;
          vehicle_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_images11_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles11";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vehicle_images11_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles11_with_images";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicle_pages111: {
        Row: {
          city_id: string;
          created_at: string | null;
          hero_h1: string | null;
          hero_subheading: string | null;
          id: string;
          meta_description: string | null;
          meta_title: string | null;
          slug: string;
          vehicle_type: string;
        };
        Insert: {
          city_id: string;
          created_at?: string | null;
          hero_h1?: string | null;
          hero_subheading?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          slug: string;
          vehicle_type: string;
        };
        Update: {
          city_id?: string;
          created_at?: string | null;
          hero_h1?: string | null;
          hero_subheading?: string | null;
          id?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          slug?: string;
          vehicle_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_pages111_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities111";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          amenities: string[] | null;
          capacity: string | null;
          created_at: string;
          description: string | null;
          id: string;
          images: string[] | null;
          min_hours: number | null;
          name: string;
          price_hourly: string | null;
          slug: string;
          type: Database["public"]["Enums"]["vehicle_type"] | null;
          updated_at: string;
        };
        Insert: {
          amenities?: string[] | null;
          capacity?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          min_hours?: number | null;
          name: string;
          price_hourly?: string | null;
          slug: string;
          type?: Database["public"]["Enums"]["vehicle_type"] | null;
          updated_at?: string;
        };
        Update: {
          amenities?: string[] | null;
          capacity?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          images?: string[] | null;
          min_hours?: number | null;
          name?: string;
          price_hourly?: string | null;
          slug?: string;
          type?: Database["public"]["Enums"]["vehicle_type"] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicles_legacy: {
        Row: {
          before5pm_3hr: number | null;
          before5pm_4hr: number | null;
          before5pm_5hr: number | null;
          before5pm_6hr: number | null;
          before5pm_7hr: number | null;
          capacity: number | null;
          categories: string | null;
          category_slugs: string | null;
          city: string | null;
          created_at: string;
          custom_instructions: string | null;
          gallery_all: string | null;
          id: number;
          image_2: string | null;
          image_3: string | null;
          image_main: string | null;
          price_10hr: number | null;
          price_3hr: number | null;
          price_4hr: number | null;
          price_5hr: number | null;
          price_6hr: number | null;
          price_7hr: number | null;
          price_8hr: number | null;
          price_9hr: number | null;
          prom_price_10hr: number | null;
          prom_price_6hr: number | null;
          prom_price_7hr: number | null;
          prom_price_8hr: number | null;
          prom_price_9hr: number | null;
          short_description: string | null;
          tag_slugs: string | null;
          tags: string | null;
          vehicle_title: string | null;
          zips: string | null;
        };
        Insert: {
          before5pm_3hr?: number | null;
          before5pm_4hr?: number | null;
          before5pm_5hr?: number | null;
          before5pm_6hr?: number | null;
          before5pm_7hr?: number | null;
          capacity?: number | null;
          categories?: string | null;
          category_slugs?: string | null;
          city?: string | null;
          created_at?: string;
          custom_instructions?: string | null;
          gallery_all?: string | null;
          id?: number;
          image_2?: string | null;
          image_3?: string | null;
          image_main?: string | null;
          price_10hr?: number | null;
          price_3hr?: number | null;
          price_4hr?: number | null;
          price_5hr?: number | null;
          price_6hr?: number | null;
          price_7hr?: number | null;
          price_8hr?: number | null;
          price_9hr?: number | null;
          prom_price_10hr?: number | null;
          prom_price_6hr?: number | null;
          prom_price_7hr?: number | null;
          prom_price_8hr?: number | null;
          prom_price_9hr?: number | null;
          short_description?: string | null;
          tag_slugs?: string | null;
          tags?: string | null;
          vehicle_title?: string | null;
          zips?: string | null;
        };
        Update: {
          before5pm_3hr?: number | null;
          before5pm_4hr?: number | null;
          before5pm_5hr?: number | null;
          before5pm_6hr?: number | null;
          before5pm_7hr?: number | null;
          capacity?: number | null;
          categories?: string | null;
          category_slugs?: string | null;
          city?: string | null;
          created_at?: string;
          custom_instructions?: string | null;
          gallery_all?: string | null;
          id?: number;
          image_2?: string | null;
          image_3?: string | null;
          image_main?: string | null;
          price_10hr?: number | null;
          price_3hr?: number | null;
          price_4hr?: number | null;
          price_5hr?: number | null;
          price_6hr?: number | null;
          price_7hr?: number | null;
          price_8hr?: number | null;
          price_9hr?: number | null;
          prom_price_10hr?: number | null;
          prom_price_6hr?: number | null;
          prom_price_7hr?: number | null;
          prom_price_8hr?: number | null;
          prom_price_9hr?: number | null;
          short_description?: string | null;
          tag_slugs?: string | null;
          tags?: string | null;
          vehicle_title?: string | null;
          zips?: string | null;
        };
        Relationships: [];
      };
      vehicles11: {
        Row: {
          amenities: string[] | null;
          capacity: number;
          city_id: string | null;
          created_at: string | null;
          id: string;
          name: string;
          storage_path: string;
          storage_path_2: string | null;
          storage_path_3: string | null;
          type: string | null;
        };
        Insert: {
          amenities?: string[] | null;
          capacity: number;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          name: string;
          storage_path: string;
          storage_path_2?: string | null;
          storage_path_3?: string | null;
          type?: string | null;
        };
        Update: {
          amenities?: string[] | null;
          capacity?: number;
          city_id?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
          storage_path?: string;
          storage_path_2?: string | null;
          storage_path_3?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      why_features: {
        Row: {
          created_at: string;
          cta_link: string | null;
          description: string | null;
          icon: string | null;
          id: number;
          modal_content: string | null;
          modal_description: string | null;
          modal_title: string | null;
          title: string | null;
          why_section_id: number | null;
        };
        Insert: {
          created_at?: string;
          cta_link?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: number;
          modal_content?: string | null;
          modal_description?: string | null;
          modal_title?: string | null;
          title?: string | null;
          why_section_id?: number | null;
        };
        Update: {
          created_at?: string;
          cta_link?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: number;
          modal_content?: string | null;
          modal_description?: string | null;
          modal_title?: string | null;
          title?: string | null;
          why_section_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "why_features_why_section_id_fkey";
            columns: ["why_section_id"];
            isOneToOne: false;
            referencedRelation: "why_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      why_sections: {
        Row: {
          id: number;
          intro: string | null;
          title: string;
          vehicle_type: string;
        };
        Insert: {
          id?: never;
          intro?: string | null;
          title: string;
          vehicle_type: string;
        };
        Update: {
          id?: never;
          intro?: string | null;
          title?: string;
          vehicle_type?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      b2r_poll_results: {
        Row: {
          category: string | null;
          group_key: string | null;
          option_id: string | null;
          option_text: string | null;
          poll_id: string | null;
          question: string | null;
          vote_count: number | null;
        };
        Relationships: [];
      };
      categories_view: {
        Row: {
          category_name: string | null;
          category_slug: string | null;
          vehicle_count: number | null;
        };
        Relationships: [];
      };
      mv_polls_options_flat: {
        Row: {
          category_slug: string | null;
          is_active: boolean | null;
          meta_json: Json | null;
          multi_select: boolean | null;
          option_id: string | null;
          option_label: string | null;
          option_sort_order: number | null;
          option_value: string | null;
          poll_id: string | null;
          poll_slug: string | null;
          question: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      poll_header_stats: {
        Row: {
          category_slug: string | null;
          total_polls: number | null;
          total_votes: number | null;
          trending_topic: string | null;
        };
        Relationships: [];
      };
      poll_option_counts: {
        Row: {
          option_id: string | null;
          poll_id: string | null;
          votes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      poll_totals: {
        Row: {
          poll_id: string | null;
          total_votes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      polls_results_view: {
        Row: {
          id: string | null;
          options: Json[] | null;
          question: string | null;
          total_votes: number | null;
        };
        Insert: {
          id?: string | null;
          options?: Json[] | null;
          question?: string | null;
          total_votes?: never;
        };
        Update: {
          id?: string | null;
          options?: Json[] | null;
          question?: string | null;
          total_votes?: never;
        };
        Relationships: [];
      };
      storage_vehicle_objects: {
        Row: {
          bucket: string | null;
          created_at: string | null;
          id: string | null;
          last_accessed_at: string | null;
          mimetype: string | null;
          object_path: string | null;
          public_url_path: string | null;
          size_bytes: number | null;
          updated_at: string | null;
        };
        Relationships: [];
      };
      storage_vehicle_prefix_rollup: {
        Row: {
          avg_bytes: number | null;
          object_count: number | null;
          prefix: string | null;
          total_bytes: number | null;
        };
        Relationships: [];
      };
      v_options_from_inline: {
        Row: {
          label: string | null;
          option_id: string | null;
          poll_id: string | null;
          poll_slug: string | null;
        };
        Relationships: [];
      };
      v_options_from_table: {
        Row: {
          label: string | null;
          option_id: string | null;
          poll_id: string | null;
          poll_slug: string | null;
        };
        Insert: {
          label?: string | null;
          option_id?: never;
          poll_id?: never;
          poll_slug?: never;
        };
        Update: {
          label?: string | null;
          option_id?: never;
          poll_id?: never;
          poll_slug?: never;
        };
        Relationships: [];
      };
      v_options_public: {
        Row: {
          option_id: string | null;
          option_label: string | null;
          poll_id_text: string | null;
          poll_slug: string | null;
        };
        Relationships: [];
      };
      v_poll_options_label: {
        Row: {
          id: string | null;
          label: string | null;
          poll_id: string | null;
          slug: string | null;
          sort_order: number | null;
        };
        Insert: {
          id?: string | null;
          label?: string | null;
          poll_id?: string | null;
          slug?: string | null;
          sort_order?: never;
        };
        Update: {
          id?: string | null;
          label?: string | null;
          poll_id?: string | null;
          slug?: string | null;
          sort_order?: never;
        };
        Relationships: [
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_options1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      v_poll_results: {
        Row: {
          option_id: string | null;
          poll_id: string | null;
          votes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_option_counts";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_options1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_options_public";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_poll_options_label";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      v_poll_results_cast: {
        Row: {
          option_id: string | null;
          option_id_text: string | null;
          poll_id: string | null;
          poll_id_text: string | null;
          votes: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_option_counts";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "poll_options1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_options_public";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_poll_options_label";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["option_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_votes1_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      v_poll_tags: {
        Row: {
          name: string | null;
          parent_slug: string | null;
          poll_id: string | null;
          slug: string | null;
          sort_order: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "mv_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "polls1";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_home";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_options_flat";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_public";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_joined_options";
            referencedColumns: ["poll_id"];
          },
          {
            foreignKeyName: "poll_tag_links_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "v_polls_with_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      v_polls_home: {
        Row: {
          id: string | null;
          question: string | null;
          slug: string | null;
        };
        Insert: {
          id?: string | null;
          question?: string | null;
          slug?: string | null;
        };
        Update: {
          id?: string | null;
          question?: string | null;
          slug?: string | null;
        };
        Relationships: [];
      };
      v_polls_options_flat: {
        Row: {
          category_slug: string | null;
          is_active: boolean | null;
          meta_json: Json | null;
          multi_select: boolean | null;
          option_id: string | null;
          option_label: string | null;
          option_sort_order: number | null;
          option_value: string | null;
          poll_id: string | null;
          poll_slug: string | null;
          question: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      v_polls_preview: {
        Row: {
          category_slug: string | null;
          options_pretty: string | null;
          poll_slug: string | null;
          question: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      v_polls_public: {
        Row: {
          category_slug: string | null;
          id: string | null;
          options: Json | null;
          question: string | null;
          show_on_polls: boolean | null;
          slug: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      v_polls_with_joined_options: {
        Row: {
          category_slug: string | null;
          is_active: boolean | null;
          meta_json: Json | null;
          multi_select: boolean | null;
          options_joined: string | null;
          poll_id: string | null;
          poll_slug: string | null;
          question: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      v_polls_with_tags: {
        Row: {
          active: boolean | null;
          category_slug: string | null;
          created_at: string | null;
          id: string | null;
          main_category: string | null;
          parent_slug: string | null;
          question: string | null;
          show_on_polls: boolean | null;
          slug: string | null;
          tag_name: string | null;
          tag_slug: string | null;
          tag_sort_order: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "poll_tag_links_tag_slug_fkey";
            columns: ["tag_slug"];
            isOneToOne: false;
            referencedRelation: "poll_tags1";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "poll_tag_links_tag_slug_fkey";
            columns: ["tag_slug"];
            isOneToOne: false;
            referencedRelation: "v_poll_tags";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "polls1_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "poll_categories1";
            referencedColumns: ["slug"];
          },
        ];
      };
      v_tool_code_active: {
        Row: {
          code: string | null;
          handler: string | null;
          inputs_schema: Json | null;
          is_active: boolean | null;
          runtime: string | null;
          tool_id: string | null;
          updated_at: string | null;
          version: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "tool_code_tool_id_fkey";
            columns: ["tool_id"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      v_tools_home: {
        Row: {
          name: string | null;
          slug: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tool_code_tool_id_fkey";
            columns: ["slug"];
            isOneToOne: false;
            referencedRelation: "tools";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicle_prices_from_legacy: {
        Row: {
          hours: number | null;
          price_matinee: number | null;
          price_prom: number | null;
          price_regular: number | null;
          vehicle_id: number | null;
        };
        Relationships: [];
      };
      vehicles11_with_images: {
        Row: {
          amenities: string[] | null;
          capacity: number | null;
          created_at: string | null;
          exterior_key: string | null;
          id: string | null;
          interior_key: string | null;
          name: string | null;
          storage_path: string | null;
          type: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _locale_subjects_cities: { Args: never; Returns: string[] };
      _locale_subjects_states: { Args: never; Returns: string[] };
      add_vehicle_amenity11: {
        Args: { p_key: string; p_vehicle_id: string };
        Returns: undefined;
      };
      ensure_category: {
        Args: { p_name?: string; p_slug: string };
        Returns: undefined;
      };
      faq_hash: {
        Args: {
          _city: string;
          _event: string;
          _question: string;
          _scope: string;
          _state: string;
        };
        Returns: string;
      };
      fetch_faqs_v2: {
        Args: {
          p_city_slug?: string;
          p_limit?: number;
          p_offset?: number;
          p_search?: string;
          p_state_slug?: string;
        };
        Returns: {
          answer: string;
          category: string;
          city_slug: string;
          created_at: string;
          hash: string;
          id: string;
          question: string;
          scope: string;
          services: string[];
          slug: string;
          state_slug: string;
          status: string;
          tags: string[];
        }[];
      };
      fetch_header: {
        Args: { p_page_slug: string };
        Returns: {
          background_url: string | null;
          created_at: string;
          email: string | null;
          gradient_from: string | null;
          gradient_to: string | null;
          gradient_via: string | null;
          id: string;
          is_active: boolean;
          page_slug: string;
          phone_display: string | null;
          phone_tel: string | null;
          primary_cta: Json | null;
          secondary_cta: Json | null;
          subtitle: string | null;
          tertiary_cta: Json | null;
          text_color: string | null;
          title: string | null;
          updated_at: string;
          wave_fill: string | null;
        };
        SetofOptions: {
          from: "*";
          to: "headers";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      fetch_hero1: { Args: { p_page_slug: string }; Returns: Json };
      generate_city_basics: {
        Args: { p_city_slug: string; p_state_slug: string };
        Returns: undefined;
      };
      generate_city_polls: {
        Args: { n?: number; p_city_slug: string; p_state_slug: string };
        Returns: undefined;
      };
      generate_city_polls_page: {
        Args: { after_id?: number; n_per_city?: number; page_size?: number };
        Returns: {
          last_city_id: number;
          processed_city_slug: string;
          processed_state_slug: string;
        }[];
      };
      generate_polls_for_all_categories: {
        Args: { n?: number };
        Returns: undefined;
      };
      generate_polls_for_categories_page: {
        Args: {
          after_slug?: string;
          n_per_category?: number;
          page_size?: number;
        };
        Returns: {
          processed_slug: string;
        }[];
      };
      generate_polls_for_category: {
        Args: { cat_slug: string; n?: number };
        Returns: undefined;
      };
      generate_polls_for_category_v2: {
        Args: { cat_slug: string; n?: number };
        Returns: undefined;
      };
      generate_state_polls: {
        Args: { n?: number; p_state_slug: string };
        Returns: undefined;
      };
      generate_state_polls_page: {
        Args: { after_code?: string; n_per_state?: number; page_size?: number };
        Returns: {
          processed_state_code: string;
          processed_state_slug: string;
        }[];
      };
      get_content_progress: {
        Args: never;
        Returns: {
          latest_created_at: string;
          latest_updated_at: string;
          row_count: number;
          tbl_name: string;
        }[];
      };
      get_events_slot: {
        Args: { p_guarantee?: string[]; p_limit?: number };
        Returns: {
          created_at: string;
          description: string;
          href: string;
          id: string;
          name: string;
          priority: number;
          slug: string;
          weight: number;
        }[];
      };
      get_style: { Args: { page: string; site: string }; Returns: Json };
      import_faqs: { Args: { items: Json }; Returns: number };
      import_reviews: {
        Args: { items: Json };
        Returns: {
          review_id: string;
          review_slug: string;
        }[];
      };
      import_tools: { Args: { items: Json }; Returns: number };
      increment_faq_click: { Args: { p_id: string }; Returns: undefined };
      increment_poll_vote: {
        Args: { p_option_id: string; p_poll_id: string };
        Returns: undefined;
      };
      increment_poll_vote_legacy: {
        Args: { p_option_id: string; p_poll_id: string };
        Returns: Json;
      };
      increment_poll_vote1: {
        Args: { p_option_id: string };
        Returns: undefined;
      };
      materialize_city_faqs:
        | {
            Args: {
              p_airport_code: string;
              p_buffer_minutes: number;
              p_city_name: string;
              p_city_nickname: string;
              p_city_slug: string;
              p_downtown_area: string;
              p_evening_peak: string;
              p_loading_street: string;
              p_major_venue: string;
              p_nightlife_district: string;
              p_offpeak_days: string;
              p_photo_spot_1: string;
              p_photo_spot_2: string;
              p_pickup_street_or_lot: string;
              p_popular_venue: string;
              p_quiet_hours: string;
              p_sensitive_area: string;
              p_state_slug: string;
              p_status?: string;
              p_weather_buffer: number;
              p_weather_pattern: string;
            };
            Returns: number;
          }
        | {
            Args: {
              p_airport_code: string;
              p_buffer_minutes: number;
              p_city_name: string;
              p_city_nickname: string;
              p_city_slug: string;
              p_downtown_area: string;
              p_evening_peak: string;
              p_loading_street: string;
              p_major_venue: string;
              p_nightlife_district: string;
              p_offpeak_days: string;
              p_photo_spot_1: string;
              p_photo_spot_2: string;
              p_pickup_street_or_lot: string;
              p_popular_venue: string;
              p_quiet_hours: string;
              p_sensitive_area: string;
              p_state_slug: string;
              p_status?: string;
              p_template_city_slug?: string;
              p_weather_buffer: number;
              p_weather_pattern: string;
            };
            Returns: number;
          };
      materialize_state_faqs: {
        Args: {
          p_airport_list: string;
          p_convention_center_list: string;
          p_popular_area_1: string;
          p_popular_area_2: string;
          p_popular_area_3: string;
          p_seasonal_condition: string;
          p_state_major_event: string;
          p_state_name: string;
          p_state_slug: string;
          p_status?: string;
          p_template_state_slug?: string;
        };
        Returns: number;
      };
      options_for_category: { Args: { cat_slug: string }; Returns: string[] };
      options_for_locale: { Args: never; Returns: string[] };
      quote_vehicles_legacy: {
        Args: {
          p_category_slug: string;
          p_city: string;
          p_event_date: string;
          p_event_type: string;
          p_hours: number;
          p_passengers: number;
          p_start_time: string;
        };
        Returns: {
          applied_hours: number;
          base_price: number;
          capacity: number;
          categories: string;
          city: string;
          notes: string;
          total_price: number;
          vehicle_id: number;
          vehicle_title: string;
        }[];
      };
      rate_review: {
        Args: { p_id: string; p_rating: number };
        Returns: undefined;
      };
      remove_vehicle_amenity11: {
        Args: { p_key: string; p_vehicle_id: string };
        Returns: undefined;
      };
      review_hash: {
        Args: { _author: string; _body: string; _date: string };
        Returns: string;
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { "": string }; Returns: string[] };
      slugify: { Args: { txt: string }; Returns: string };
      slugify1: { Args: { t: string }; Returns: string };
      unaccent: { Args: { "": string }; Returns: string };
      upsert_hero1: {
        Args: { p_data: Json; p_page_slug: string };
        Returns: Json;
      };
      upsert_poll: {
        Args: {
          p_category_slugs?: string[];
          p_city_slug?: string;
          p_description: string;
          p_is_active?: boolean;
          p_option_labels: string[];
          p_scope?: string;
          p_slug: string;
          p_sort_priority?: number;
          p_state_slug?: string;
          p_tag_slugs?: string[];
          p_title: string;
        };
        Returns: number;
      };
      upsert_poll_with_options: {
        Args: {
          _category_slug: string;
          _is_active: boolean;
          _meta_json: Json;
          _multi_select: boolean;
          _options: Json;
          _poll_slug: string;
          _question: string;
        };
        Returns: string;
      };
      upsert_polls1_from_json: { Args: { payload: Json }; Returns: number };
      vote_and_tallies: {
        Args: { p_option_id: string; p_poll_id: string; p_voter_key: string };
        Returns: {
          option_id: string;
          total: number;
          votes: number;
        }[];
      };
    };
    Enums: {
      block_type: "hero" | "cta" | "faq_group" | "rich_text";
      token_kind:
        | "color"
        | "space"
        | "radius"
        | "shadow"
        | "font"
        | "size"
        | "other";
      token_scope: "global" | "theme";
      vehicle_image_role: "exterior" | "interior" | "feature";
      vehicle_type: "party-bus" | "limo" | "coach";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      block_type: ["hero", "cta", "faq_group", "rich_text"],
      token_kind: [
        "color",
        "space",
        "radius",
        "shadow",
        "font",
        "size",
        "other",
      ],
      token_scope: ["global", "theme"],
      vehicle_image_role: ["exterior", "interior", "feature"],
      vehicle_type: ["party-bus", "limo", "coach"],
    },
  },
} as const;
