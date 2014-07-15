-- ----------------------------------------------------------
-- MDB Tools - A library for reading MS Access database files
-- Copyright (C) 2000-2011 Brian Bruns and others.
-- Files in libmdb are licensed under LGPL and the utilities under
-- the GPL, see COPYING.LIB and COPYING files respectively.
-- Check out http://mdbtools.sourceforge.net
-- ----------------------------------------------------------

-- That file uses encoding UTF-8

CREATE TABLE "tbRoute"
 (
	"CodeRoute"			int, 
	"NoRoute"			char (1), 
	"NomRoute"			varchar (5), 
	"CodeA"			varchar (4), 
	"CodeC"			varchar (4), 
	"CodeD"			varchar (4), 
	"CodeT"			varchar (4), 
	"XTE_Masque"			bit NOT NULL, 
	"CodeW"			varchar (4), 
	"CodeX"			varchar (4), 
	"VMax"			char (1), 
	"OffsetMax"			char (1), 
	"OffsetVillage"			char (1), 
	"Tri2"			smallint
);
COMMENT ON COLUMN "tbRoute"."CodeRoute" IS 'identificateur de la route';
COMMENT ON COLUMN "tbRoute"."NoRoute" IS 'numéro de la route';
COMMENT ON COLUMN "tbRoute"."NomRoute" IS 'nom de la route (nom du 1er WPT)';
COMMENT ON COLUMN "tbRoute"."CodeA" IS 'code accès';
COMMENT ON COLUMN "tbRoute"."CodeC" IS 'code GPS';
COMMENT ON COLUMN "tbRoute"."CodeD" IS 'codeD';
COMMENT ON COLUMN "tbRoute"."CodeT" IS 'codeTIM';
COMMENT ON COLUMN "tbRoute"."XTE_Masque" IS 'XTE masqué';
COMMENT ON COLUMN "tbRoute"."CodeW" IS 'CodeWPM (masqué)';
COMMENT ON COLUMN "tbRoute"."CodeX" IS 'CodeXME (XTE, Masqué, Eclipse)';
COMMENT ON COLUMN "tbRoute"."VMax" IS 'la vitesse max pour la route';
COMMENT ON COLUMN "tbRoute"."OffsetMax" IS 'Offset vitesse max';
COMMENT ON COLUMN "tbRoute"."OffsetVillage" IS 'Offset vitesse village';
COMMENT ON COLUMN "tbRoute"."Tri2" IS 'sert à céer un index double lorsqu''on renomme un NoRoute et que 2 Routes ont le même numéro.';

CREATE TABLE "tbWpt"
 (
	"CodeWpt"			int, 
	"CodeRoute"			int, 
	"NomWpt"			varchar (5), 
	"NoWpt"			smallint, 
	"LatDeg"			char (1), 
	"LatMin"			char (1), 
	"LatMil"			smallint, 
	"Hem"			varchar (1), 
	"LongDeg"			char (1), 
	"LongMin"			char (1), 
	"LongMil"			smallint, 
	"Grw"			varchar (1), 
	"NbModif"			char (1), 
	"RadiusWpt"			smallint, 
	"RadiusVis"			smallint, 
	"VitLim"			char (1), 
	"VitInter"			char (1), 
	"actif"			bit NOT NULL, 
	"CP"			bit NOT NULL, 
	"WPM"			bit NOT NULL, 
	"WPE"			bit NOT NULL, 
	"CodeB"			varchar (4), 
	"Tri2"			smallint, 
	"Odometre"			int, 
	"NoWptNav"			smallint, 
	"NoWptAsr"			smallint, 
	"Nav"			bit NOT NULL, 
	"Asr"			bit NOT NULL, 
	"Tpe"			bit NOT NULL, 
	"Tpc"			bit NOT NULL, 
	"Tps"			bit NOT NULL
);
COMMENT ON COLUMN "tbWpt"."CodeWpt" IS 'identificateur du Wpt';
COMMENT ON COLUMN "tbWpt"."CodeRoute" IS 'identificateur de la route à laquelle appartient le Wpt (lié à tbRoute)';
COMMENT ON COLUMN "tbWpt"."NomWpt" IS 'nom du Wpt';
COMMENT ON COLUMN "tbWpt"."NoWpt" IS 'numéro d''ordre du Wpt';
COMMENT ON COLUMN "tbWpt"."LatDeg" IS 'degrés de latitude';
COMMENT ON COLUMN "tbWpt"."LatMin" IS 'minutes de latitude';
COMMENT ON COLUMN "tbWpt"."LatMil" IS 'millièmes de latitude';
COMMENT ON COLUMN "tbWpt"."Hem" IS 'hémisphère';
COMMENT ON COLUMN "tbWpt"."LongDeg" IS 'degrés de longitude';
COMMENT ON COLUMN "tbWpt"."LongMin" IS 'minutes de longitude';
COMMENT ON COLUMN "tbWpt"."LongMil" IS 'millièmes de longitude';
COMMENT ON COLUMN "tbWpt"."Grw" IS 'Greenwich';
COMMENT ON COLUMN "tbWpt"."NbModif" IS 'nombre de modifs possibles du Wpt';
COMMENT ON COLUMN "tbWpt"."RadiusWpt" IS 'radius du Wpt';
COMMENT ON COLUMN "tbWpt"."RadiusVis" IS 'radius de visibilité des Wpts invisibles';
COMMENT ON COLUMN "tbWpt"."VitLim" IS 'vitesse limite pour ce Wpt (0 par défaut)';
COMMENT ON COLUMN "tbWpt"."VitInter" IS 'vitesse limite entre ce Wpt et le suivant (0 par défaut)';
COMMENT ON COLUMN "tbWpt"."actif" IS 'Wpt activé ou pas (vrai par défaut)';
COMMENT ON COLUMN "tbWpt"."CP" IS 'contrôle passage virtuels';
COMMENT ON COLUMN "tbWpt"."WPM" IS 'Wpt masqué';
COMMENT ON COLUMN "tbWpt"."WPE" IS 'Wpt éclipse';
COMMENT ON COLUMN "tbWpt"."CodeB" IS 'code Wpt';
COMMENT ON COLUMN "tbWpt"."Tri2" IS 'sert à céer un index double lorsqu''on renomme un NoWpt et que 2 Wpts ont le même numéro.';
COMMENT ON COLUMN "tbWpt"."Odometre" IS 'valeur odomètre du wpt';
COMMENT ON COLUMN "tbWpt"."NoWptNav" IS 'numéro d''ordre du Wpt parmi les Wpts Nav';
COMMENT ON COLUMN "tbWpt"."NoWptAsr" IS 'numéro d''ordre du Wpt parmi les Wpts ASR';
COMMENT ON COLUMN "tbWpt"."Nav" IS 'Wpt de navigation ou pas (vrai par défaut)';
COMMENT ON COLUMN "tbWpt"."Asr" IS 'Wpt ASR ou pas (faux par défaut)';
COMMENT ON COLUMN "tbWpt"."Tpe" IS 'Temps de passage entrée ou pas (faux par défaut)';
COMMENT ON COLUMN "tbWpt"."Tpc" IS 'Temps de passage au centre ou pas (faux par défaut)';
COMMENT ON COLUMN "tbWpt"."Tps" IS 'Temps de passage sortie ou pas (faux par défaut)';

CREATE TABLE "tbParam"
 (
	"CodeParam"			int, 
	"LibParam"			varchar (20), 
	"ValParam"			varchar (50)
);
COMMENT ON COLUMN "tbParam"."LibParam" IS 'libellé du paramètre';
COMMENT ON COLUMN "tbParam"."ValParam" IS 'valeur du paramètre';


