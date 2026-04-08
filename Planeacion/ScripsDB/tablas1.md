| table_schema | table_name              | column_name            | data_type                   | is_nullable |
| ------------ | ----------------------- | ---------------------- | --------------------------- | ----------- |
| academico    | categorias              | idcategoria            | integer                     | NO          |
| academico    | categorias              | nombrecategoria        | character varying           | NO          |
| academico    | categorias              | edadmin                | integer                     | NO          |
| academico    | categorias              | edadmax                | integer                     | NO          |
| academico    | posiciones              | idposicion             | integer                     | NO          |
| academico    | posiciones              | nombreposicion         | character varying           | NO          |
| academico    | temporadas              | idtemporada            | integer                     | NO          |
| academico    | temporadas              | anioinicio             | integer                     | NO          |
| academico    | temporadas              | aniofin                | integer                     | NO          |
| academico    | temporadas              | activa                 | boolean                     | NO          |
| competencia  | equipos                 | idequipo               | integer                     | NO          |
| competencia  | equipos                 | nombre                 | character varying           | NO          |
| competencia  | equipos                 | idcategoria            | integer                     | NO          |
| competencia  | equipos                 | fechacreacion          | date                        | NO          |
| competencia  | equipos                 | activo                 | boolean                     | NO          |
| competencia  | jugador_equipo          | idjugadorequipo        | integer                     | NO          |
| competencia  | jugador_equipo          | idjugador              | integer                     | NO          |
| competencia  | jugador_equipo          | idequipo               | integer                     | NO          |
| competencia  | jugador_equipo          | fechaingreso           | date                        | NO          |
| competencia  | jugador_equipo          | fechasalida            | date                        | YES         |
| competencia  | partidos                | idpartido              | integer                     | NO          |
| competencia  | partidos                | idtorneo               | integer                     | NO          |
| competencia  | partidos                | fecha                  | date                        | NO          |
| competencia  | partidos                | hora                   | time without time zone      | NO          |
| competencia  | partidos                | lugar                  | character varying           | YES         |
| competencia  | partidos                | resultado              | character varying           | YES         |
| competencia  | torneos                 | idtorneo               | integer                     | NO          |
| competencia  | torneos                 | nombre                 | character varying           | NO          |
| competencia  | torneos                 | tipo                   | character varying           | NO          |
| competencia  | torneos                 | fechainicio            | date                        | NO          |
| competencia  | torneos                 | fechafin               | date                        | NO          |
| competencia  | torneos                 | idtemporada            | integer                     | NO          |
| extensions   | pg_stat_statements      | userid                 | oid                         | YES         |
| extensions   | pg_stat_statements      | dbid                   | oid                         | YES         |
| extensions   | pg_stat_statements      | toplevel               | boolean                     | YES         |
| extensions   | pg_stat_statements      | queryid                | bigint                      | YES         |
| extensions   | pg_stat_statements      | query                  | text                        | YES         |
| extensions   | pg_stat_statements      | plans                  | bigint                      | YES         |
| extensions   | pg_stat_statements      | total_plan_time        | double precision            | YES         |
| extensions   | pg_stat_statements      | min_plan_time          | double precision            | YES         |
| extensions   | pg_stat_statements      | max_plan_time          | double precision            | YES         |
| extensions   | pg_stat_statements      | mean_plan_time         | double precision            | YES         |
| extensions   | pg_stat_statements      | stddev_plan_time       | double precision            | YES         |
| extensions   | pg_stat_statements      | calls                  | bigint                      | YES         |
| extensions   | pg_stat_statements      | total_exec_time        | double precision            | YES         |
| extensions   | pg_stat_statements      | min_exec_time          | double precision            | YES         |
| extensions   | pg_stat_statements      | max_exec_time          | double precision            | YES         |
| extensions   | pg_stat_statements      | mean_exec_time         | double precision            | YES         |
| extensions   | pg_stat_statements      | stddev_exec_time       | double precision            | YES         |
| extensions   | pg_stat_statements      | rows                   | bigint                      | YES         |
| extensions   | pg_stat_statements      | shared_blks_hit        | bigint                      | YES         |
| extensions   | pg_stat_statements      | shared_blks_read       | bigint                      | YES         |
| extensions   | pg_stat_statements      | shared_blks_dirtied    | bigint                      | YES         |
| extensions   | pg_stat_statements      | shared_blks_written    | bigint                      | YES         |
| extensions   | pg_stat_statements      | local_blks_hit         | bigint                      | YES         |
| extensions   | pg_stat_statements      | local_blks_read        | bigint                      | YES         |
| extensions   | pg_stat_statements      | local_blks_dirtied     | bigint                      | YES         |
| extensions   | pg_stat_statements      | local_blks_written     | bigint                      | YES         |
| extensions   | pg_stat_statements      | temp_blks_read         | bigint                      | YES         |
| extensions   | pg_stat_statements      | temp_blks_written      | bigint                      | YES         |
| extensions   | pg_stat_statements      | shared_blk_read_time   | double precision            | YES         |
| extensions   | pg_stat_statements      | shared_blk_write_time  | double precision            | YES         |
| extensions   | pg_stat_statements      | local_blk_read_time    | double precision            | YES         |
| extensions   | pg_stat_statements      | local_blk_write_time   | double precision            | YES         |
| extensions   | pg_stat_statements      | temp_blk_read_time     | double precision            | YES         |
| extensions   | pg_stat_statements      | temp_blk_write_time    | double precision            | YES         |
| extensions   | pg_stat_statements      | wal_records            | bigint                      | YES         |
| extensions   | pg_stat_statements      | wal_fpi                | bigint                      | YES         |
| extensions   | pg_stat_statements      | wal_bytes              | numeric                     | YES         |
| extensions   | pg_stat_statements      | jit_functions          | bigint                      | YES         |
| extensions   | pg_stat_statements      | jit_generation_time    | double precision            | YES         |
| extensions   | pg_stat_statements      | jit_inlining_count     | bigint                      | YES         |
| extensions   | pg_stat_statements      | jit_inlining_time      | double precision            | YES         |
| extensions   | pg_stat_statements      | jit_optimization_count | bigint                      | YES         |
| extensions   | pg_stat_statements      | jit_optimization_time  | double precision            | YES         |
| extensions   | pg_stat_statements      | jit_emission_count     | bigint                      | YES         |
| extensions   | pg_stat_statements      | jit_emission_time      | double precision            | YES         |
| extensions   | pg_stat_statements      | jit_deform_count       | bigint                      | YES         |
| extensions   | pg_stat_statements      | jit_deform_time        | double precision            | YES         |
| extensions   | pg_stat_statements      | stats_since            | timestamp with time zone    | YES         |
| extensions   | pg_stat_statements      | minmax_stats_since     | timestamp with time zone    | YES         |
| extensions   | pg_stat_statements_info | dealloc                | bigint                      | YES         |
| extensions   | pg_stat_statements_info | stats_reset            | timestamp with time zone    | YES         |
| financiero   | conceptos_pago          | idconcepto             | integer                     | NO          |
| financiero   | conceptos_pago          | nombreconcepto         | character varying           | NO          |
| financiero   | conceptos_pago          | montobase              | numeric                     | NO          |
| financiero   | conceptos_pago          | esrecurrente           | boolean                     | NO          |
| financiero   | conceptos_pago          | activo                 | boolean                     | NO          |
| financiero   | facturas                | idfactura              | integer                     | NO          |
| financiero   | facturas                | idjugador              | integer                     | NO          |
| financiero   | facturas                | fechaemision           | date                        | NO          |
| financiero   | facturas                | fechavencimiento       | date                        | NO          |
| financiero   | facturas                | estado                 | character varying           | NO          |
| financiero   | pagos                   | idpago                 | integer                     | NO          |
| financiero   | pagos                   | idfactura              | integer                     | NO          |
| financiero   | pagos                   | fechapago              | date                        | NO          |
| financiero   | pagos                   | montopagado            | numeric                     | NO          |
| personal     | entrenadores            | identrenador           | integer                     | NO          |
| personal     | entrenadores            | idusuario              | integer                     | NO          |
| personal     | entrenadores            | especialidad           | character varying           | YES         |
| personal     | entrenadores            | fechacontratacion      | date                        | NO          |
| personal     | entrenadores            | activo                 | boolean                     | NO          |
| personal     | jugadores               | idjugador              | integer                     | NO          |
| personal     | jugadores               | idusuario              | integer                     | NO          |
| personal     | jugadores               | idcategoria            | integer                     | NO          |
| personal     | jugadores               | idposicion             | integer                     | NO          |
| personal     | jugadores               | fechaingreso           | date                        | NO          |
| personal     | jugadores               | activo                 | boolean                     | NO          |
| public       | entrenamientos          | id                     | uuid                        | NO          |
| public       | entrenamientos          | titulo                 | text                        | NO          |
| public       | entrenamientos          | fecha                  | text                        | NO          |
| public       | entrenamientos          | hora                   | text                        | YES         |
| public       | entrenamientos          | lugar                  | text                        | YES         |
| public       | entrenamientos          | categoria              | text                        | YES         |
| public       | entrenamientos          | descripcion            | text                        | YES         |
| public       | entrenamientos          | activo                 | boolean                     | YES         |
| public       | jugadores               | id                     | uuid                        | NO          |
| public       | jugadores               | nombre                 | text                        | NO          |
| public       | jugadores               | apellido               | text                        | NO          |
| public       | jugadores               | posicion               | text                        | YES         |
| public       | jugadores               | categoria              | text                        | YES         |
| public       | jugadores               | numero_camiseta        | integer                     | YES         |
| public       | jugadores               | goles                  | integer                     | YES         |
| public       | jugadores               | asistencias            | integer                     | YES         |
| public       | jugadores               | tarjetas_amarillas     | integer                     | YES         |
| public       | jugadores               | tarjetas_rojas         | integer                     | YES         |
| public       | jugadores               | foto_url               | text                        | YES         |
| public       | partidos                | id                     | uuid                        | NO          |
| public       | partidos                | equipo_local           | text                        | NO          |
| public       | partidos                | equipo_visitante       | text                        | NO          |
| public       | partidos                | fecha                  | text                        | NO          |
| public       | partidos                | hora                   | text                        | YES         |
| public       | partidos                | lugar                  | text                        | YES         |
| public       | partidos                | goles_local            | integer                     | YES         |
| public       | partidos                | goles_visitante        | integer                     | YES         |
| public       | partidos                | estado                 | text                        | YES         |
| public       | partidos                | categoria              | text                        | YES         |
| public       | partidos                | descripcion            | text                        | YES         |
| public       | perfiles                | id                     | uuid                        | NO          |
| public       | perfiles                | rol                    | text                        | YES         |
| public       | perfiles                | activo                 | boolean                     | YES         |
| public       | rendimiento_equipos     | id                     | uuid                        | NO          |
| public       | rendimiento_equipos     | equipo                 | text                        | NO          |
| public       | rendimiento_equipos     | categoria              | text                        | YES         |
| public       | rendimiento_equipos     | partidos               | integer                     | YES         |
| public       | rendimiento_equipos     | ganados                | integer                     | YES         |
| public       | rendimiento_equipos     | empatados              | integer                     | YES         |
| public       | rendimiento_equipos     | perdidos               | integer                     | YES         |
| public       | rendimiento_equipos     | goles_favor            | integer                     | YES         |
| public       | rendimiento_equipos     | goles_contra           | integer                     | YES         |
| public       | rendimiento_equipos     | puntos                 | integer                     | YES         |
| public       | torneos                 | id                     | uuid                        | NO          |
| public       | torneos                 | nombre                 | text                        | NO          |
| public       | torneos                 | categoria              | text                        | YES         |
| public       | torneos                 | fecha_inicio           | text                        | NO          |
| public       | torneos                 | fecha_fin              | text                        | YES         |
| public       | torneos                 | estado                 | text                        | YES         |
| public       | torneos                 | descripcion            | text                        | YES         |
| public       | torneos                 | logo_url               | text                        | YES         |
| public       | torneos                 | resultado              | text                        | YES         |
| rendimiento  | asistencias             | idasistencia           | integer                     | NO          |
| rendimiento  | asistencias             | identrenamiento        | integer                     | NO          |
| rendimiento  | asistencias             | idjugador              | integer                     | NO          |
| rendimiento  | asistencias             | estado                 | character varying           | NO          |
| rendimiento  | entrenamientos          | identrenamiento        | integer                     | NO          |
| rendimiento  | entrenamientos          | fecha                  | date                        | NO          |
| rendimiento  | entrenamientos          | horainicio             | time without time zone      | NO          |
| rendimiento  | entrenamientos          | horafin                | time without time zone      | NO          |
| rendimiento  | entrenamientos          | lugar                  | character varying           | YES         |
| rendimiento  | entrenamientos          | identrenador           | integer                     | NO          |
| rendimiento  | entrenamientos          | idtipoentrenamiento    | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | idestadistica          | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | idjugador              | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | goles                  | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | asistencias            | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | tarjetasamarillas      | integer                     | NO          |
| rendimiento  | estadisticas_jugador    | tarjetasrojas          | integer                     | NO          |
| rendimiento  | eventos_partido         | idevento               | integer                     | NO          |
| rendimiento  | eventos_partido         | idpartido              | integer                     | NO          |
| rendimiento  | eventos_partido         | idjugador              | integer                     | NO          |
| rendimiento  | eventos_partido         | tipo_evento            | character varying           | NO          |
| rendimiento  | eventos_partido         | minuto                 | integer                     | YES         |
| rendimiento  | eventos_partido         | descripcion            | text                        | YES         |
| rendimiento  | eventos_partido         | creado_en              | timestamp without time zone | YES         |
| rendimiento  | tipo_entrenamiento      | idtipoentrenamiento    | integer                     | NO          |
| rendimiento  | tipo_entrenamiento      | nombre                 | character varying           | NO          |
| seguridad    | notificaciones          | idnotificacion         | integer                     | NO          |
| seguridad    | notificaciones          | idusuario              | integer                     | NO          |
| seguridad    | notificaciones          | titulo                 | character varying           | YES         |
| seguridad    | notificaciones          | mensaje                | text                        | YES         |
| seguridad    | notificaciones          | leida                  | boolean                     | YES         |
| seguridad    | notificaciones          | tipo                   | character varying           | YES         |
| seguridad    | notificaciones          | referencia_id          | integer                     | YES         |
| seguridad    | notificaciones          | creada_en              | timestamp without time zone | YES         |
| seguridad    | roles                   | idrol                  | integer                     | NO          |
| seguridad    | roles                   | nombrerol              | character varying           | NO          |
| seguridad    | roles                   | descripcion            | character varying           | YES         |
| seguridad    | roles                   | activo                 | boolean                     | NO          |
| seguridad    | usuarios                | idusuario              | integer                     | NO          |
| seguridad    | usuarios                | primernombre           | character varying           | NO          |
| seguridad    | usuarios                | segundonombre          | character varying           | YES         |
| seguridad    | usuarios                | primerapellido         | character varying           | NO          |
| seguridad    | usuarios                | segundoapellido        | character varying           | YES         |
| seguridad    | usuarios                | correo                 | character varying           | NO          |
| seguridad    | usuarios                | telefono               | character varying           | YES         |
| seguridad    | usuarios                | passwordhash           | character varying           | NO          |
| seguridad    | usuarios                | idrol                  | integer                     | NO          |
| seguridad    | usuarios                | fechacreacion          | timestamp without time zone | NO          |
| seguridad    | usuarios                | activo                 | boolean                     | NO          |