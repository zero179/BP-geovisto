--
-- PostgreSQL database dump
--

-- Dumped from database version 15.0
-- Dumped by pg_dump version 15.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: files; Type: TABLE; Schema: public; Owner: damian
--

CREATE TABLE public.files (
    file_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    content text
);


ALTER TABLE public.files OWNER TO damian;

--
-- Name: files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: damian
--

CREATE SEQUENCE public.files_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_file_id_seq OWNER TO damian;

--
-- Name: files_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: damian
--

ALTER SEQUENCE public.files_file_id_seq OWNED BY public.files.file_id;


--
-- Name: userfile; Type: TABLE; Schema: public; Owner: damian
--

CREATE TABLE public.userfile (
    user_id integer NOT NULL,
    file_id integer NOT NULL,
    role character varying(50)
);


ALTER TABLE public.userfile OWNER TO damian;

--
-- Name: users; Type: TABLE; Schema: public; Owner: damian
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at date DEFAULT CURRENT_DATE
);


ALTER TABLE public.users OWNER TO damian;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: damian
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO damian;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: damian
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: files file_id; Type: DEFAULT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.files ALTER COLUMN file_id SET DEFAULT nextval('public.files_file_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: damian
--

COPY public.files (file_id, filename, content) FROM stdin;
17	uloz	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            44.296875,\n                            50.708951\n                        ],\n                        [\n                            42.539063,\n                            68.775023\n                        ],\n                        [\n                            108.984375,\n                            69.52607\n                        ],\n                        [\n                            44.296875,\n                            50.708951\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
18	ahoj	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            56.25,\n                            49.12375\n                        ],\n                        [\n                            50.976563,\n                            68.259798\n                        ],\n                        [\n                            103.007813,\n                            64.610841\n                        ],\n                        [\n                            56.25,\n                            49.12375\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
2	tesat_file2.txt	Sample content 2
10	test123	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            29.197079,\n                            63.335376\n                        ],\n                        [\n                            31.659484,\n                            75.292624\n                        ],\n                        [\n                            70.354408,\n                            65.752537\n                        ],\n                        [\n                            29.197079,\n                            63.335376\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
16	testovanie	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            44.296875,\n                            37.677064\n                        ],\n                        [\n                            45,\n                            60.396602\n                        ],\n                        [\n                            93.515625,\n                            55.356593\n                        ],\n                        [\n                            44.296875,\n                            37.677064\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
19	simonko	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            39.375,\n                            58.794839\n                        ],\n                        [\n                            45.351563,\n                            73.917704\n                        ],\n                        [\n                            113.203125,\n                            73.322622\n                        ],\n                        [\n                            109.335938,\n                            58.428449\n                        ],\n                        [\n                            39.375,\n                            58.794839\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
30	simon123	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            0.701152,\n                            55.633674\n                        ],\n                        [\n                            14.400377,\n                            70.059481\n                        ],\n                        [\n                            55.146788,\n                            62.152597\n                        ],\n                        [\n                            0.701152,\n                            55.633674\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
55	ahojahojahoj	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            -18.267005,\n                            45.646332\n                        ],\n                        [\n                            4.916298,\n                            61.987849\n                        ],\n                        [\n                            26.694552,\n                            43.644639\n                        ],\n                        [\n                            -18.267005,\n                            45.646332\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
36	slovenskoslovensko	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            40.967517,\n                            69.930692\n                        ],\n                        [\n                            65.583166,\n                            77.639762\n                        ],\n                        [\n                            100.045074,\n                            53.163073\n                        ],\n                        [\n                            40.967517,\n                            69.930692\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
37	cesko	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            -5.976563,\n                            71.882288\n                        ],\n                        [\n                            18.632813,\n                            55.215753\n                        ],\n                        [\n                            44.296875,\n                            70.986545\n                        ],\n                        [\n                            -5.976563,\n                            71.882288\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
60	madarsko	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            -30.9375,\n                            52.946707\n                        ],\n                        [\n                            17.226563,\n                            69.315504\n                        ],\n                        [\n                            42.1875,\n                            53.577869\n                        ],\n                        [\n                            -30.9375,\n                            52.946707\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
31	test12test	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            49.570313,\n                            58.976687\n                        ],\n                        [\n                            65.742188,\n                            71.293939\n                        ],\n                        [\n                            99.140625,\n                            59.157491\n                        ],\n                        [\n                            67.5,\n                            49.809618\n                        ],\n                        [\n                            49.570313,\n                            58.976687\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
41	obdlznik	{\n    "type": "FeatureCollection",\n    "features": [\n        {\n            "type": "Feature",\n            "properties": {\n                "draggable": true,\n                "transform": true,\n                "stroke-width": 5,\n                "fill": "#1ABC9C",\n                "fill-opacity": 0.2,\n                "stroke-opacity": 0.5\n            },\n            "geometry": {\n                "type": "Polygon",\n                "coordinates": [\n                    [\n                        [\n                            37.96875,\n                            55.951912\n                        ],\n                        [\n                            38.671875,\n                            70.487971\n                        ],\n                        [\n                            115.664063,\n                            66.641887\n                        ],\n                        [\n                            108.28125,\n                            50.03596\n                        ],\n                        [\n                            37.96875,\n                            55.951912\n                        ]\n                    ]\n                ]\n            }\n        }\n    ]\n}
\.


--
-- Data for Name: userfile; Type: TABLE DATA; Schema: public; Owner: damian
--

COPY public.userfile (user_id, file_id, role) FROM stdin;
10	17	\N
12	17	read
16	18	read
10	60	owner
10	31	owner
12	2	read
10	41	owner
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: damian
--

COPY public.users (user_id, email, password, created_at) FROM stdin;
10	jan1.peter@gmail.com	$2a$10$Ym5ebwLdQb.2KhPug2xxfur1nWoMg8zEt389lAK1EbMBVbaKhRR3S	2023-04-27
11	jozef.hahahah@gmail.com	$2a$10$4iOzLwvRtdP8cp5HYvMKsOAPXwmIP/cABmfcTTfZvXXCLE49MbzaW	2023-04-27
12	jozef.aaaahovnoa@gmail.com	$2a$10$/5mvevqM8BYfdXdU8w5wmeMcZMo.mZNu4nhKIyltKXvLz2t6mhZ/C	2023-04-27
13	jozef.ahoja@gmail.com	$2a$10$2zYggRe2.J3fg7G8fRcHo.L78aS5PvFBsd4qjPJcI3NM4f.g1ri6i	2023-04-27
14	martin.ahoj@gmail.com	$2a$10$WsKjgrOwzGWhnNWH88v50e7l2wTVSXL4Q5V4iMrM/6b1QkTpn.P9e	2023-04-27
3	jozef.fenko@gmail.com	$2a$10$2OwL7KdBYkeyg7SgAjCsr.bP4QvqRFKSzwzAaR2O5VQti/PwcHH1W	2023-04-24
16	adammamm.novak@gmail.com	$2a$10$QUzStlwxn2A.lTASRAtFeeYPOVmNAHNLXQly/4on0Wl.BwP2xTTi2	2023-04-28
6	adamko.kolacikvlacik@gmail.com	hihihihihihihihi	2023-04-24
8	peter.petejojor@gmail.com	$2a$10$vHsELAdtOhZ2qP6DqahCauHT28E99U7QbmBMkVCuatGeHddL8YxUa	2023-04-27
17	simon.fenko@gmail.com	$2a$10$UbhaEOgRT6uEGwsSza.CUOikYYh.IYKxN3szbccVaXcn5vCy3xj/i	2023-05-27
\.


--
-- Name: files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: damian
--

SELECT pg_catalog.setval('public.files_file_id_seq', 3, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: damian
--

SELECT pg_catalog.setval('public.users_user_id_seq', 17, true);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (file_id);


--
-- Name: userfile userfile_pkey; Type: CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.userfile
    ADD CONSTRAINT userfile_pkey PRIMARY KEY (user_id, file_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: userfile userfile_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.userfile
    ADD CONSTRAINT userfile_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(file_id);


--
-- Name: userfile userfile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: damian
--

ALTER TABLE ONLY public.userfile
    ADD CONSTRAINT userfile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

