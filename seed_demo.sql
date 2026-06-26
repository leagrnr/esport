-- ============================================================
-- SEED DEMO — Pixel War
-- Démontre l'équité malgré un déséquilibre de participants :
--   Camp LoL  : 10 spectateurs
--   Camp Valo :  5 spectateurs
-- ============================================================
-- Lancer dans Supabase > SQL Editor

-- 1. Fake spectateurs (pas de compte auth, uniquement la table utilisateur)
INSERT INTO utilisateur (email, pseudo, role, camp, points_classement) VALUES
  ('lol1@demo.fr',  'Faker_jr',    'spectateur', 'lol',  0),
  ('lol2@demo.fr',  'Yasuo_fan',   'spectateur', 'lol',  0),
  ('lol3@demo.fr',  'ADC_life',    'spectateur', 'lol',  0),
  ('lol4@demo.fr',  'JungleDiff',  'spectateur', 'lol',  0),
  ('lol5@demo.fr',  'MidOrFeed',   'spectateur', 'lol',  0),
  ('lol6@demo.fr',  'TopLaner',    'spectateur', 'lol',  0),
  ('lol7@demo.fr',  'SupportMain', 'spectateur', 'lol',  0),
  ('lol8@demo.fr',  'Penta_GG',    'spectateur', 'lol',  0),
  ('lol9@demo.fr',  'Dragon_Buff', 'spectateur', 'lol',  0),
  ('lol10@demo.fr', 'Baron_Rush',  'spectateur', 'lol',  0),
  ('valo1@demo.fr', 'Operator_OP', 'spectateur', 'valo', 0),
  ('valo2@demo.fr', 'KnifeFight',  'spectateur', 'valo', 0),
  ('valo3@demo.fr', 'FlashOrb',    'spectateur', 'valo', 0),
  ('valo4@demo.fr', 'SpikeRush',   'spectateur', 'valo', 0),
  ('valo5@demo.fr', 'AceEvery',    'spectateur', 'valo', 0)
ON CONFLICT (email) DO NOTHING;

-- 2. Récupère les IDs des équipes existantes pour construire des matchs de test
-- (adapte si tu n'as pas encore d'équipes)
DO $$
DECLARE
  v_eq1 INTEGER; v_eq2 INTEGER;
  v_eq3 INTEGER; v_eq4 INTEGER;
  v_m1  INTEGER; v_m2  INTEGER; v_m3  INTEGER;
  -- utilisateurs lol et valo
  lol_ids  INTEGER[];
  valo_ids INTEGER[];
BEGIN
  -- Récupère les 4 premières équipes
  SELECT array_agg(id ORDER BY id) INTO v_eq1 FROM (SELECT id FROM equipe ORDER BY id LIMIT 1) t;
  SELECT array_agg(id ORDER BY id) INTO v_eq2 FROM (SELECT id FROM equipe ORDER BY id OFFSET 1 LIMIT 1) t;
  SELECT array_agg(id ORDER BY id) INTO v_eq3 FROM (SELECT id FROM equipe ORDER BY id OFFSET 2 LIMIT 1) t;
  SELECT array_agg(id ORDER BY id) INTO v_eq4 FROM (SELECT id FROM equipe ORDER BY id OFFSET 3 LIMIT 1) t;

  -- Besoin d'au moins 2 équipes
  IF v_eq1 IS NULL OR v_eq2 IS NULL THEN
    RAISE NOTICE 'Pas assez d équipes. Crée au moins 2 équipes dans l app d abord.';
    RETURN;
  END IF;

  IF v_eq3 IS NULL THEN v_eq3 := v_eq1; END IF;
  IF v_eq4 IS NULL THEN v_eq4 := v_eq2; END IF;

  -- 3. Crée 3 matchs terminés
  INSERT INTO match (jeu_id, equipe1_id, equipe2_id, statut, phase, gagnant_id)
    VALUES (1, v_eq1[1], v_eq2[1], 'termine', 'Groupe A', v_eq1[1])
    RETURNING id INTO v_m1;
  INSERT INTO match (jeu_id, equipe1_id, equipe2_id, statut, phase, gagnant_id)
    VALUES (2, v_eq3[1], v_eq4[1], 'termine', 'Groupe B', v_eq4[1])
    RETURNING id INTO v_m2;
  INSERT INTO match (jeu_id, equipe1_id, equipe2_id, statut, phase, gagnant_id)
    VALUES (1, v_eq2[1], v_eq3[1], 'termine', 'Demi-finale', v_eq2[1])
    RETURNING id INTO v_m3;

  -- 4. Collecte les IDs des utilisateurs seed
  SELECT array_agg(id ORDER BY email) INTO lol_ids
  FROM utilisateur WHERE email LIKE '%@demo.fr' AND camp = 'lol';
  SELECT array_agg(id ORDER BY email) INTO valo_ids
  FROM utilisateur WHERE email LIKE '%@demo.fr' AND camp = 'valo';

  -- 5. Pronostics match 1 : LoL 7/10 corrects, Valo 4/5 corrects
  --    (Valo a un meilleur taux → son score moyen sera plus haut)
  INSERT INTO pronostic (utilisateur_id, match_id, equipe_gagnante_id) VALUES
    (lol_ids[1],  v_m1, v_eq1[1]), (lol_ids[2],  v_m1, v_eq1[1]),
    (lol_ids[3],  v_m1, v_eq1[1]), (lol_ids[4],  v_m1, v_eq1[1]),
    (lol_ids[5],  v_m1, v_eq1[1]), (lol_ids[6],  v_m1, v_eq1[1]),
    (lol_ids[7],  v_m1, v_eq1[1]),
    (lol_ids[8],  v_m1, v_eq2[1]), (lol_ids[9],  v_m1, v_eq2[1]),
    (lol_ids[10], v_m1, v_eq2[1]),
    (valo_ids[1], v_m1, v_eq1[1]), (valo_ids[2], v_m1, v_eq1[1]),
    (valo_ids[3], v_m1, v_eq1[1]), (valo_ids[4], v_m1, v_eq1[1]),
    (valo_ids[5], v_m1, v_eq2[1])
  ON CONFLICT DO NOTHING;

  -- 6. Pronostics match 2
  INSERT INTO pronostic (utilisateur_id, match_id, equipe_gagnante_id) VALUES
    (lol_ids[1],  v_m2, v_eq4[1]), (lol_ids[2],  v_m2, v_eq4[1]),
    (lol_ids[3],  v_m2, v_eq3[1]), (lol_ids[4],  v_m2, v_eq3[1]),
    (lol_ids[5],  v_m2, v_eq4[1]), (lol_ids[6],  v_m2, v_eq3[1]),
    (lol_ids[7],  v_m2, v_eq4[1]), (lol_ids[8],  v_m2, v_eq4[1]),
    (lol_ids[9],  v_m2, v_eq3[1]), (lol_ids[10], v_m2, v_eq4[1]),
    (valo_ids[1], v_m2, v_eq4[1]), (valo_ids[2], v_m2, v_eq4[1]),
    (valo_ids[3], v_m2, v_eq4[1]), (valo_ids[4], v_m2, v_eq4[1]),
    (valo_ids[5], v_m2, v_eq4[1])
  ON CONFLICT DO NOTHING;

  -- 7. Pronostics match 3
  INSERT INTO pronostic (utilisateur_id, match_id, equipe_gagnante_id) VALUES
    (lol_ids[1],  v_m3, v_eq2[1]), (lol_ids[2],  v_m3, v_eq2[1]),
    (lol_ids[3],  v_m3, v_eq2[1]), (lol_ids[4],  v_m3, v_eq3[1]),
    (lol_ids[5],  v_m3, v_eq2[1]), (lol_ids[6],  v_m3, v_eq3[1]),
    (lol_ids[7],  v_m3, v_eq2[1]), (lol_ids[8],  v_m3, v_eq2[1]),
    (lol_ids[9],  v_m3, v_eq3[1]), (lol_ids[10], v_m3, v_eq2[1]),
    (valo_ids[1], v_m3, v_eq2[1]), (valo_ids[2], v_m3, v_eq2[1]),
    (valo_ids[3], v_m3, v_eq2[1]), (valo_ids[4], v_m3, v_eq2[1]),
    (valo_ids[5], v_m3, v_eq3[1])
  ON CONFLICT DO NOTHING;

  -- 8. Résoudre les 3 matchs (calcule scores + pixels)
  PERFORM resoudre_match(v_m1, v_eq1[1]);
  PERFORM resoudre_match(v_m2, v_eq4[1]);
  PERFORM resoudre_match(v_m3, v_eq2[1]);

  RAISE NOTICE 'Seed OK — matchs %, %, %', v_m1, v_m2, v_m3;
END $$;

-- Vérifie le résultat
SELECT camp, score_moyen, nb_participants_actifs, pixels_debloques FROM camp_score;
