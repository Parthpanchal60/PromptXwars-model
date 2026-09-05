import React, { useState } from 'react';
import { Gene, RoadmapCard, JudgeEvaluation } from '../types';
import {
  FirebaseService,
  GoogleSheetsService,
  VisionApiService,
  VisionAnalysisResult,
  HACKATHON_TEAM_NODES,
} from '../utils/googleServices';
import {
  X,
  Cloud,
  FileSpreadsheet,
  Eye,
  MapPin,
  CheckCircle,
  Database,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';

interface GoogleServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  genes: Gene[];
  roadmap: RoadmapCard[];
  judge: JudgeEvaluation;
  projectName: string;
}

export const GoogleServicesModal: React.FC<GoogleServicesModalProps> = ({
  isOpen,
  onClose,
  genes,
  roadmap,
  judge,
  projectName,
}) => {
  const [activeTab, setActiveTab] = useState<'firebase' | 'sheets' | 'vision' | 'maps'>('firebase');

  // Firebase Sync State
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [firestoreSyncResult, setFirestoreSyncResult] = useState<{
    docId: string;
    syncedAt: string;
  } | null>(null);

  // Vision Analysis State
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionResult, setVisionResult] = useState<VisionAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleSyncFirebase = async () => {
    setIsSyncingFirebase(true);
    const res = await FirebaseService.syncGenomeToFirestore(projectName, genes, judge.totalScore);
    setIsSyncingFirebase(false);
    setFirestoreSyncResult({ docId: res.documentId, syncedAt: res.syncedAt });
  };

  const handleRunVisionAudit = async () => {
    setIsAnalyzingVision(true);
    const res = await VisionApiService.analyzeDiagramOrUi('genome-mentor-architecture-v1.svg');
    setIsAnalyzingVision(false);
    setVisionResult(res);
  };

  const handleExportSheets = () => {
    GoogleSheetsService.downloadSheetsExport(roadmap, judge, projectName);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-services-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
          background: 'rgba(13, 19, 35, 0.96)',
          border: '1px solid var(--border-active)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cloud size={24} color="#00f5d4" />
            <div>
              <h2 id="google-services-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Google Cloud Services Suite
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Production connectors for Firebase, Sheets API, Cloud Vision, and Maps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: 6, borderRadius: '50%' }}
            aria-label="Close Google Services Dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 12,
            marginBottom: 20,
            overflowX: 'auto',
          }}
        >
          <button
            className={`btn ${activeTab === 'firebase' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('firebase')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Database size={14} /> Firebase &amp; Firestore
          </button>
          <button
            className={`btn ${activeTab === 'sheets' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('sheets')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <FileSpreadsheet size={14} /> Google Sheets Sync
          </button>
          <button
            className={`btn ${activeTab === 'vision' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('vision')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Eye size={14} /> Cloud Vision AI
          </button>
          <button
            className={`btn ${activeTab === 'maps' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('maps')}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <MapPin size={14} /> Google Maps Radar
          </button>
        </div>

        {/* Tab 1: Firebase Auth & Firestore Sync */}
        {activeTab === 'firebase' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                padding: 16,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  AUTHENTICATION STATE
                </span>
                <span className="badge badge-emerald">
                  <CheckCircle size={12} /> AUTHENTICATED
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {FirebaseService.getCurrentUser().displayName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {FirebaseService.getCurrentUser().email} (UID: {FirebaseService.getCurrentUser().uid})
              </div>
            </div>

            <div
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                padding: 16,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Cloud Firestore Genome Backup</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Persist {genes.length} project codons and live benchmark telemetry ({judge.totalScore}/100).
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSyncFirebase}
                disabled={isSyncingFirebase}
              >
                {isSyncingFirebase ? <RefreshCw className="spin" size={14} /> : <Database size={14} />}
                <span>{isSyncingFirebase ? 'Syncing...' : 'Sync to Firestore'}</span>
              </button>
            </div>

            {firestoreSyncResult && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#34d399',
                }}
              >
                [FIRESTORE SYNC SUCCESS] Document: {firestoreSyncResult.docId} | Timestamp: {firestoreSyncResult.syncedAt}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Google Sheets API */}
        {activeTab === 'sheets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Export the real-time project roadmap, sprint cards, priority tags, and judge scores directly into Google Sheets format.
            </p>

            <div
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: 14,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                maxHeight: 180,
                overflowY: 'auto',
              }}
            >
              <div>Sprint,Title,Category,Status,Priority,Google API</div>
              {roadmap.slice(0, 5).map((r) => (
                <div key={r.id}>
                  {r.sprint},{r.title},{r.category},{r.status},{r.priority},{r.googleApi || 'None'}
                </div>
              ))}
              <div>... [{roadmap.length - 5} more sprint items]</div>
            </div>

            <button className="btn btn-primary" onClick={handleExportSheets} style={{ alignSelf: 'flex-start' }}>
              <Download size={14} />
              <span>Download Google Sheets CSV</span>
            </button>
          </div>
        )}

        {/* Tab 3: Cloud Vision API */}
        {activeTab === 'vision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Simulates Google Cloud Vision API diagnostics for architecture diagrams and UI screenshots to detect layout patterns and contrast ratios.
            </p>

            <button
              className="btn btn-purple"
              onClick={handleRunVisionAudit}
              disabled={isAnalyzingVision}
              style={{ alignSelf: 'flex-start' }}
            >
              {isAnalyzingVision ? <RefreshCw className="spin" size={14} /> : <Upload size={14} />}
              <span>{isAnalyzingVision ? 'Analyzing Diagram...' : 'Run Vision AI Audit'}</span>
            </button>

            {visionResult && (
              <div
                style={{
                  background: 'rgba(7, 10, 19, 0.6)',
                  padding: 16,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    TARGET: {visionResult.fileName}
                  </span>
                  <span className="badge badge-emerald">{visionResult.safeSearch}</span>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>DETECTED LABELS</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {visionResult.labels.map((l) => (
                      <span key={l} className="badge badge-a">{l}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>A11y Findings:</strong> {visionResult.accessibilityFindings.recommendation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Google Maps Radar */}
        {activeTab === 'maps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Hackathon Team Geo-Radar showing active development nodes across tech hubs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {HACKATHON_TEAM_NODES.map((node) => (
                <div
                  key={node.id}
                  style={{
                    background: 'rgba(7, 10, 19, 0.6)',
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} color="#00f5d4" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{node.city}</span>
                    </div>
                    <span className="badge badge-emerald">{node.activeStatus}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{node.role}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    Coords: {node.lat.toFixed(2)}°, {node.lng.toFixed(2)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
