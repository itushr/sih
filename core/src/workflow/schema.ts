import pool from "../config/database.js";

export async function ensureWorkflowTables(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS workflow_registry (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL DEFAULT 'Untitled workflow',
            description TEXT,
            start UUID,
            created_by UUID,
            by_platform UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        ALTER TABLE workflow_registry
            ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Untitled workflow',
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS start UUID,
            ADD COLUMN IF NOT EXISTS created_by UUID,
            ADD COLUMN IF NOT EXISTS by_platform UUID,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
    `);

    await pool.query(`
        ALTER TABLE workflow_registry
            ALTER COLUMN start DROP NOT NULL
    `).catch(() => {});

    await pool.query(`
        ALTER TABLE workflow_registry DROP CONSTRAINT IF EXISTS workflow_registry_start_fkey;
        ALTER TABLE workflow_registry ADD CONSTRAINT workflow_registry_start_fkey
            FOREIGN KEY (start) REFERENCES workflow_node_registry(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
    `).catch(() => {});

    await pool.query(`
        UPDATE workflow_registry
        SET created_by = COALESCE(created_by, by_platform),
            by_platform = COALESCE(by_platform, created_by),
            name = COALESCE(name, 'Untitled workflow'),
            updated_at = COALESCE(updated_at, created_at, NOW())
        WHERE created_by IS NULL OR by_platform IS NULL OR name IS NULL OR updated_at IS NULL
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS workflow_node_registry (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workflow UUID NOT NULL REFERENCES workflow_registry(id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            payload JSONB NOT NULL DEFAULT '{}'::jsonb,
            on_success UUID,
            on_error UUID,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);

    await pool.query(`
        ALTER TABLE workflow_node_registry
            ADD COLUMN IF NOT EXISTS workflow UUID,
            ADD COLUMN IF NOT EXISTS type TEXT,
            ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb,
            ADD COLUMN IF NOT EXISTS on_success UUID,
            ADD COLUMN IF NOT EXISTS on_error UUID,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()
    `);

    await pool.query(`
        ALTER TABLE workflow_node_registry DROP CONSTRAINT IF EXISTS workflow_node_registry_on_success_fkey;
        ALTER TABLE workflow_node_registry ADD CONSTRAINT workflow_node_registry_on_success_fkey
            FOREIGN KEY (on_success) REFERENCES workflow_node_registry(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

        ALTER TABLE workflow_node_registry DROP CONSTRAINT IF EXISTS workflow_node_registry_on_error_fkey;
        ALTER TABLE workflow_node_registry ADD CONSTRAINT workflow_node_registry_on_error_fkey
            FOREIGN KEY (on_error) REFERENCES workflow_node_registry(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
    `).catch(() => {});

    await pool.query(`
        CREATE TABLE IF NOT EXISTS running_workflow_registry (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            data JSONB NOT NULL DEFAULT '{}'::jsonb,
            workflow UUID NOT NULL REFERENCES workflow_registry(id),
            start UUID NOT NULL,
            current UUID NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);

    await pool.query(`
        ALTER TABLE running_workflow_registry
            ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb,
            ADD COLUMN IF NOT EXISTS workflow UUID,
            ADD COLUMN IF NOT EXISTS start UUID,
            ADD COLUMN IF NOT EXISTS current UUID,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
    `);

    await pool.query(`
        ALTER TABLE running_workflow_registry
            ALTER COLUMN start DROP NOT NULL
    `).catch(() => {});

    await pool.query(`
        ALTER TABLE running_workflow_registry DROP CONSTRAINT IF EXISTS running_workflow_registry_start_fkey;
        ALTER TABLE running_workflow_registry ADD CONSTRAINT running_workflow_registry_start_fkey
            FOREIGN KEY (start) REFERENCES workflow_node_registry(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

        ALTER TABLE running_workflow_registry DROP CONSTRAINT IF EXISTS running_workflow_registry_current_fkey;
        ALTER TABLE running_workflow_registry ADD CONSTRAINT running_workflow_registry_current_fkey
            FOREIGN KEY (current) REFERENCES workflow_node_registry(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
    `).catch(() => {});

    await pool.query(`
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_run_status') THEN
                BEGIN
                    ALTER TYPE workflow_run_status ADD VALUE IF NOT EXISTS 'PAUSED';
                EXCEPTION WHEN others THEN NULL;
                END;
                BEGIN
                    ALTER TYPE workflow_run_status ADD VALUE IF NOT EXISTS 'WAITING_INPUT';
                EXCEPTION WHEN others THEN NULL;
                END;
            END IF;
        END $$;
    `).catch(() => {});

    await pool.query(`
        CREATE INDEX IF NOT EXISTS workflow_node_registry_workflow_idx
            ON workflow_node_registry (workflow)
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS running_workflow_registry_workflow_idx
            ON running_workflow_registry (workflow)
    `);
}
