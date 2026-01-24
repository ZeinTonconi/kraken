-- CreateIndex
CREATE INDEX "enrollments_offering_id_track_status_idx" ON "enrollments"("offering_id", "track", "status");

-- CreateIndex
CREATE INDEX "enrollments_offering_id_track_primary_role_idx" ON "enrollments"("offering_id", "track", "primary_role");
