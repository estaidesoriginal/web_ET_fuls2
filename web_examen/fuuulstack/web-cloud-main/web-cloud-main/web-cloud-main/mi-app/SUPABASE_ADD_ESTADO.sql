-- SQL para ejecutar en Supabase SQL Editor
-- Esto agregará la columna 'estado' a la tabla compras

-- Agregar columna estado si no existe
ALTER TABLE compras 
ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'pendiente' NOT NULL;

-- Actualizar compras existentes que no tengan estado
UPDATE compras 
SET estado = 'pendiente' 
WHERE estado IS NULL;

-- Verificar que se agregó correctamente
SELECT id, nombre, apellido, total, fecha, estado 
FROM compras 
ORDER BY fecha DESC 
LIMIT 5;
