// lib/google-drive-client.ts
export class GoogleDriveClient {
  private static instance: GoogleDriveClient

  static getInstance() {
    if (!this.instance) {
      this.instance = new GoogleDriveClient()
    }
    return this.instance
  }

  async checkAuth(): Promise<boolean> {
    try {
      const response = await fetch('/api/google-drive/check-auth')
      const data = await response.json()
      return data.authenticated
    } catch (error) {
      return false
    }
  }

  async authenticate() {
    const response = await fetch('/api/google-drive/auth')
    const data = await response.json()
    window.location.href = data.url
  }

  async backupUser(user: any, action: 'CREATE' | 'UPDATE' | 'DELETE') {
    const response = await fetch('/api/google-drive/backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, action })
    })

    if (!response.ok) {
      throw new Error('Backup failed')
    }

    return await response.json()
  }

  async createDailyBackup(users: any[]) {
    const response = await fetch('/api/google-drive/daily-backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ users })
    })

    if (!response.ok) {
      throw new Error('Daily backup failed')
    }

    return await response.json()
  }
}